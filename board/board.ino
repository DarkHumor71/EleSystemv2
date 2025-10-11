#include <WiFi.h>
#include <HTTPClient.h>

// --- Wi-Fi credentials ---
const char* ssid = "hotcold1";
const char* password = "Mirna2016";
const String MID="ELE1";

// --- Pin Definitions ---
const int buttonPins[] = {19, 21, 22, 23};       // Buttons for floors 0, 1, 2, 3
const int irSensorPins[] = {18, 5, 17, 16};       // IR sensors for floors 0, 1, 2, 3
const int elevatorMotorUpPin = 13;
const int elevatorMotorDownPin = 12;
const int PWR = 32;
const int ERR = 33;
const int STP = 14;
const int RDY = 4;
const int Asens = 34; 
// --- Display Pins ---
const int latchPin = 26;
const int clockPin = 25;
const int dataPin = 27;

// --- 7-Segment Display Codes (0–3) ---
const int NUM[4] = {
  0b00111111, // 0
  0b00000110, // 1
  0b01011011, // 2
  0b01001111  // 3
};

// --- Queue Variables ---
const int MAX_QUEUE_SIZE = 10;
int floorQueue[MAX_QUEUE_SIZE];
int queueSize = 0;

// --- Elevator State ---
int currentFloor = 0;
int targetFloor = 0;
bool moving = false;
int direction = -1;  // 1 = up, -1 = down
bool emergencyStopped = false;
bool sessionVerified = false;  // Flag to track if the session is verified

// --- Timing & Movement State ---
unsigned long lastMoveCheckTime = 0;
unsigned long moveDelay = 10;

bool isMovingUp = false;
bool isMovingDown = false;

unsigned long lastButtonCheck = 0;
const unsigned long debounceDelay = 200;
unsigned long motorStartTime = 0;
float motorElapsedTime = 0.0;
float time2send = 0.0;
float voltageSum = 0.0;
float currentSum = 0.0;
int sampleCount = 0;

float totalAvgCurrent = 0.0;
const float Vref = 5.0;           // ADC reference voltage (5V for most Arduinos)
const float zeroCurrentVoltage = 2.5; // No-load voltage from ACS712 (typically 2.5V)
const float sensitivity = 0.185;  // Sensitivity in V/A (0.185 for 5A module)

// ========== SETUP ==========
void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int wifiRetryCount = 0;
  const int maxWifiRetries = 20;
  while (WiFi.status() != WL_CONNECTED && wifiRetryCount < maxWifiRetries) {
    delay(500);
    Serial.print(".");
    wifiRetryCount++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.println(WiFi.localIP());
    digitalWrite(ERR, LOW);
  } else {
    Serial.println("\nWiFi connection failed!");
    digitalWrite(ERR, HIGH);
  }

  // Setup pins
  pinMode(PWR, OUTPUT);
  pinMode(ERR, OUTPUT);
  digitalWrite(PWR, HIGH);
  digitalWrite(ERR, LOW);

  pinMode(elevatorMotorUpPin, OUTPUT);
  pinMode(elevatorMotorDownPin, OUTPUT);
  digitalWrite(elevatorMotorUpPin, LOW);
  digitalWrite(elevatorMotorDownPin, LOW);

  pinMode(STP, INPUT);
  pinMode(RDY,OUTPUT);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);

  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT);
    pinMode(irSensorPins[i], INPUT);
  }

  updateDisplay();
  Serial.println("Elevator system initialized.");
}

// ========== LOOP ========== 
void loop() {
  checkIRSensors();
  verifySessionOnce();
  if (sessionVerified) {
    digitalWrite(RDY, HIGH);
    digitalWrite(ERR, LOW);
    Serial.println("Session OK. Elevator ready.");
    checkStopButton();
    if (emergencyStopped) {
      Serial.println("Elevator emergency stopped.");
      digitalWrite(ERR, HIGH);
      return;  // Skip rest of logic during emergency
    }
    checkButtons();
    checkIRSensors();
    handleRunMotor();
    updateMovement();
  } else {
    digitalWrite(RDY, LOW);
    digitalWrite(ERR, HIGH);
    Serial.println("Session not verified. Elevator not ready.");
  }
  delay(100);  // Control loop frequency
}

// --- Session verification logic split out for clarity ---
void verifySessionOnce() {
  // Only verify once per power cycle
  if (sessionVerified) return;
  int sessionRetryCount = 0;
  const int maxSessionRetries = 5;
  while (!sessionVerified && sessionRetryCount < maxSessionRetries) {
    HTTPClient http;
    String url = "http://192.168.1.103:5000/api/apartment/session";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"brain\":\"P6p8h3uD&JQNWh\",\"mid\":\"" + MID + "\"}";
    int httpResponseCode = http.POST(payload);
    Serial.print("Session Check Response: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    http.end();
    if (response == "OK" ) {
      sessionVerified = true;
      Serial.println("Session Verified");
    } else {
      Serial.println("Session failed. Retrying...");
      digitalWrite(RDY, LOW);
      motorElapsedTime = 0.0;  // Reset motor time
      motorStartTime = 0;
      delay(1000);
      sessionRetryCount++;
    }
  }
  if (!sessionVerified) {
    Serial.println("Session verification failed after retries.");
  }
}


// ========== Wi-Fi Data Sender ==========
void sendDataToServer(float value,float power) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return;
  }

  int dataRetryCount = 0;
  const int maxDataRetries = 5;
  bool sent = false;
  while (!sent && dataRetryCount < maxDataRetries) {
    HTTPClient http;
    String url = "http://192.168.1.103:5000/api/expense/create";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String payload = 
      "{\"time\":" + String(value, 3) + 
      ",\"power\":" + String(power, 2) + 
      ",\"brain\":\"P6p8h3uD&JQNWh\",\"mid\":\"" + MID + "\"}";

    int httpResponseCode = http.POST(payload);
    if (httpResponseCode == 200) {
      Serial.print("Data POST Response: ");
      Serial.println(httpResponseCode);
      sent = true;
    } else {
      Serial.print("Data POST failed, code: ");
      Serial.println(httpResponseCode);
      delay(500);
      dataRetryCount++;
    }
    http.end();
  }
  if (!sent) {
    Serial.println("Failed to send data after retries.");
  }
}


// ========== Elevator Logic ==========
void handleRunMotor() {
  digitalWrite(ERR, LOW);
  digitalWrite(PWR, HIGH);

  if (!moving && queueSize > 0) {
    targetFloor = getNextFloor();
    Serial.print("Target Floor: ");
    Serial.println(targetFloor);
    moveElevator();
  }
}

void moveElevator() {
  if (targetFloor == currentFloor) {
    Serial.println("Already at target floor. No movement needed.");
    moving = false;
    return;
  }

  moving = true;
  if (targetFloor > currentFloor) moveUp();
  else moveDown();
}

void moveUp() {
  Serial.print("Moving UP to floor ");
  Serial.println(targetFloor);
  isMovingUp = true;
  motorStartTime = millis();  // Start timing
  digitalWrite(elevatorMotorUpPin, HIGH);
}

void moveDown() {
  Serial.print("Moving DOWN to floor ");
  Serial.println(targetFloor);
  isMovingDown = true;
  motorStartTime = millis();  // Start timing
  digitalWrite(elevatorMotorDownPin, HIGH);
}

float getAverageCurrent(int samples = 100) {
  float sum = 0;
  int validSamples = 0;
  for (int i = 0; i < samples; i++) {
    int val = analogRead(Asens);
    float voltage = (val * Vref) / 1024.0;
    float current = (voltage - zeroCurrentVoltage) / sensitivity;
    // Ignore negative or out-of-range values
    if (current >= 0 && current < 100.0) {
      sum += current;
      validSamples++;
    }
    delayMicroseconds(500); // optional
  }
  if (validSamples == 0) return 0.0;
  return sum / validSamples;
}

void updateMovement() {
  float avgCurrent = getAverageCurrent(100); // 100 samples for smoothing
currentSum += avgCurrent;
sampleCount++;


  if (millis() - lastMoveCheckTime < moveDelay) return;
  lastMoveCheckTime = millis();

  if ((isMovingUp || isMovingDown) && digitalRead(irSensorPins[targetFloor]) == HIGH) {
    if (isMovingUp) {
      digitalWrite(elevatorMotorUpPin, LOW);
      isMovingUp = false;
    }
    if (isMovingDown) {
      digitalWrite(elevatorMotorDownPin, LOW);
      isMovingDown = false;
    }

    // Add elapsed time
    if (motorStartTime > 0) {
      motorElapsedTime += (millis() - motorStartTime) / 1000.0;
motorStartTime = 0;

    }

    Serial.println("Arrived at floor.");
    arriveAtFloor();
  }
}


void arriveAtFloor() {

  currentFloor = targetFloor;
  moving = false;
  removeFromQueue(targetFloor);
  updateDisplay();

  // Check if we're done with the full queue
  if (queueSize == 0 && motorElapsedTime > 0.0) {
    time2send += motorElapsedTime; // Reset for next session
  }
  if (sampleCount > 0) {
  float avgCurrent = currentSum / sampleCount;
  avgCurrent= avgCurrent*10;
  totalAvgCurrent += avgCurrent;


  Serial.print(" Average Current: ");
  Serial.print(avgCurrent);
  Serial.println(" mA");

  currentSum = 0;
  sampleCount = 0;
}

  delay(2000);
}


// ========== Queue Handling ==========
void addToQueue(int floor) {
  if (floor == currentFloor) return;  // Already at this floor

  for (int i = 0; i < queueSize; i++) {
    if (floorQueue[i] == floor) return;  // Already in queue
  }

  if (queueSize < MAX_QUEUE_SIZE) {
    floorQueue[queueSize++] = floor;
    Serial.print("Added floor ");
    Serial.println(floor);
  } else {
    Serial.println("Queue is full!");
  }
}


void removeFromQueue(int floor) {
  for (int i = 0; i < queueSize; i++) {
    if (floorQueue[i] == floor) {
      for (int j = i; j < queueSize - 1; j++) {
        floorQueue[j] = floorQueue[j + 1];
      }
      queueSize--;
      break;
    }
  }
}

int getNextFloor() {
  // Try in current direction first
  for (int i = 0; i < queueSize; i++) {
    if (i >= MAX_QUEUE_SIZE) break;
    if ((direction == 1 && floorQueue[i] > currentFloor) ||
        (direction == -1 && floorQueue[i] < currentFloor)) {
      return floorQueue[i];
    }
  }

  // Flip direction and try again
  direction *= -1;
  for (int i = 0; i < queueSize; i++) {
    if (i >= MAX_QUEUE_SIZE) break;
    if ((direction == 1 && floorQueue[i] > currentFloor) ||
        (direction == -1 && floorQueue[i] < currentFloor)) {
      return floorQueue[i];
    }
  }

  // Default: return first in queue if valid
  if (queueSize > 0 && queueSize <= MAX_QUEUE_SIZE) {
    return floorQueue[0];
  }
  return currentFloor; // fallback if queue is empty or invalid
}


// ========== Button Handling ==========
void checkButtons() {
  static int lastButtonStates[4] = {LOW, LOW, LOW, LOW};
  for (int i = 0; i < 4; i++) {
    int currentState = digitalRead(buttonPins[i]);
    if (currentState == HIGH && lastButtonStates[i] == LOW) {
      // Button press detected (rising edge)
      Serial.print("Button pressed: Floor ");
      Serial.println(i);
      addToQueue(i);
      lastButtonCheck = millis();
    }
    lastButtonStates[i] = currentState;
  }
}

// ========== IR Sensor ==========
void checkIRSensors() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(irSensorPins[i]) == HIGH) {
      if (currentFloor != i) {
        Serial.print("IR sensor triggered. Now at floor ");
        Serial.println(i);
        currentFloor = i;
        updateDisplay();
      }
      break;
    }
  }
}

// ========== Display ==========
void updateDisplay() {
  Serial.print("Display: Floor ");
  Serial.println(currentFloor);
  changeNumber(currentFloor);
}

void changeNumber(int floor) {
  digitalWrite(latchPin, LOW);
  shiftOut(dataPin, clockPin, MSBFIRST, NUM[floor]);
  digitalWrite(latchPin, HIGH);
}
void checkStopButton() {

  if (digitalRead(STP) == HIGH) {

  Serial.println("EMERGENCY STOP TRIGGERED!");
  digitalWrite(elevatorMotorUpPin, LOW);
  digitalWrite(elevatorMotorDownPin, LOW);
  isMovingUp = false;
  isMovingDown = false;
  moving = false;
  digitalWrite(ERR, HIGH);
  queueSize = 0;
  emergencyStopped = true;

  // Record motor time if applicable
  if (motorStartTime > 0) {
    motorElapsedTime += (millis() - motorStartTime) / 1000.0;
    motorStartTime = 0;
  }
float power = totalAvgCurrent*22.2;
  sendDataToServer(time2send,power);
  emergencyStopped= false;
  sessionVerified = false;
  totalAvgCurrent = 0.0;
  time2send = 0.0;
  }
}
