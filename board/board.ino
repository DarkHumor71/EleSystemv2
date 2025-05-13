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
const int elevatorMotorDownPin = 15;
const int PWR = 32;
const int ERR = 33;
const int STP = 14;
const int RDY = 4;
const int Vsens = 34; 
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
bool sessionVerified = true;  // Flag to track if the session is verified

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

float totalAvgVoltage = 0.0;
float totalAvgCurrent = 0.0;


// ========== SETUP ==========
void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

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
  // Perform session verification only once
  if (!sessionVerified) {
    HTTPClient http;
    String url = "http://192.168.1.103:5000/api/apartment/session";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"brain\":\"P6p8h3uD&JQNWh\",\"MID\":\"" + MID + "\"}";

    int httpResponseCode = http.POST(payload);
    Serial.print("Session Check Response: ");
    Serial.println(httpResponseCode);

    String response = http.getString();
    http.end();

    if (response == "OK" || true) {
      sessionVerified = true;
      Serial.println("Session Verified");
    } 
    if (response != "OK" && false) {
  Serial.println("Session failed. Retrying...");
  digitalWrite(RDY, LOW);
  motorElapsedTime = 0.0;  // Reset motor time
  motorStartTime = 0;
  delay(1000);
  return;
}

  }

  // Main logic runs only if session is verified
  if (sessionVerified) {
    digitalWrite(RDY, HIGH);
    checkStopButton();
    if (emergencyStopped) {
      return;  // Skip rest of logic during emergency
    }

    checkButtons();
    checkIRSensors();
    handleRunMotor();
    updateMovement();
  } else {
    digitalWrite(RDY, LOW);
  }

  delay(1000);  // Control loop frequency
}


// ========== Wi-Fi Data Sender ==========
void sendDataToServer(float value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return;
  }

  while (true) {
    HTTPClient http;
    String url = "http://192.168.1.103:5000/api/expense/create";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String payload = 
      "{\"time\":" + String(value, 2) + 
      ",\"voltage\":" + String(totalAvgVoltage, 2) + 
      ",\"current\":" + String(totalAvgCurrent, 2) + 
      ",\"brain\":\"P6p8h3uD&JQNWh\",\"MID\":\"" + MID + "\"}";

    int httpResponseCode = http.POST(payload);
    if (httpResponseCode == 200) {
      Serial.print("Data POST Response: ");
      Serial.println(httpResponseCode);
      http.end();
      break;
    }
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


void updateMovement() {
  int analogValue = analogRead(Vsens); 
float analogVoltage = analogValue * (3.3 / 4095.0); // Convert ADC to actual voltage
float motorVoltage = analogVoltage * 5;             // Adjust based on divider ratio
float motorCurrent = (motorVoltage / 12) * 1000.0; // Convert to milliamps

voltageSum += motorVoltage;
currentSum += motorCurrent;
sampleCount++;

Serial.print("Motor Voltage: ");
Serial.print(motorVoltage);
Serial.print(" V");
Serial.print("  Current: ");
Serial.print(motorCurrent);
Serial.println(" mA");

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
  float avgVoltage = voltageSum / sampleCount;
  float avgCurrent = currentSum / sampleCount;

  totalAvgVoltage += avgVoltage;
  totalAvgCurrent += avgCurrent;

  Serial.print("Average Voltage this run: ");
  Serial.print(avgVoltage);
  Serial.print(" V, Average Current: ");
  Serial.print(avgCurrent);
  Serial.println(" mA");

  voltageSum = 0;
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
    if ((direction == 1 && floorQueue[i] > currentFloor) ||
        (direction == -1 && floorQueue[i] < currentFloor)) {
      return floorQueue[i];
    }
  }

  // Flip direction and try again
  direction *= -1;
  for (int i = 0; i < queueSize; i++) {
    if ((direction == 1 && floorQueue[i] > currentFloor) ||
        (direction == -1 && floorQueue[i] < currentFloor)) {
      return floorQueue[i];
    }
  }

  // Default: return first in queue
  return floorQueue[0];
}


// ========== Button Handling ==========
void checkButtons() {
  if (millis() - lastButtonCheck < debounceDelay) return;

  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == HIGH) {
      Serial.print("Button pressed: Floor ");
      Serial.println(i);
      addToQueue(i);
      lastButtonCheck = millis();
      break;
    }
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
  totalAvgVoltage = 0.0;
  totalAvgCurrent = 0.0;

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

  sendDataToServer(time2send);
  sessionVerified = false;
  time2send = 0.0;
}
}
