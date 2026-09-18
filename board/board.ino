#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_INA228.h>
#include <freertos/FreeRTOS.h>
#include <freertos/event_groups.h>
#include <freertos/queue.h>
#include <freertos/task.h>

// The control task alone owns the motor, inputs, display, and elevator state.
// HTTP runs in a separate lower-priority task and cannot block the stop input.
const char *ssid = "hotcold1";
const char *password = "Mirna2016";
const char *MID = "ELE1";
const char *BRAIN_CODE = "P6p8h3uD&JQNWh";
const char *SESSION_URL = "http://192.168.1.103:5000/api/apartment/session";
const char *EXPENSE_URL = "http://192.168.1.103:5000/api/expense/create";

const int buttonPins[] = {33, 34, 14, 25};
const int irSensorPins[] = {32, 35, 27, 26};
const int elevatorMotorUpPin = 15;
const int elevatorMotorDownPin = 13;
const int PWR = 22;
const int ERR = 23;
const int STP = 19;
const int RDY = 4;
const int I2C[] = {16, 17};
const int latchPin = 18;
const int clockPin = 5;
const int dataPin = 21;
const uint8_t NUM[] = {0b00111111, 0b00000110, 0b01011011, 0b01001111};

const TickType_t CONTROL_PERIOD = pdMS_TO_TICKS(10);
const TickType_t NETWORK_RETRY = pdMS_TO_TICKS(1000);
const EventBits_t SESSION_READY = BIT0;
const EventBits_t STOP_ACTIVE = BIT1;
const EventBits_t SENSOR_READY = BIT2;
const int MAX_QUEUE_SIZE = 10;
// Set these to the actual shunt resistor and expected peak current on the PCB.
const float SHUNT_RESISTANCE_OHMS = 0.1f;
const float MAX_CURRENT_A = 3.2f;

struct ExpenseReport {
  float seconds;
  float power;
};

QueueHandle_t expenseQueue;
QueueHandle_t currentQueue;
EventGroupHandle_t sessionEvents;
Adafruit_INA228 currentSensor;

int floorQueue[MAX_QUEUE_SIZE];
int queueSize = 0;
int currentFloor = 0;
int targetFloor = 0;
int direction = -1;
bool moving = false;
bool stopLatched = false;
bool reportFault = false;
unsigned long motorStartTime = 0;
unsigned long arrivalTime = 0;
unsigned long lastButtonCheck = 0;
float motorElapsedTime = 0;
float currentSum = 0;
uint32_t sampleCount = 0;
float totalAvgCurrent = 0;

void setMotor(bool up, bool down) {
  digitalWrite(elevatorMotorUpPin, LOW);
  digitalWrite(elevatorMotorDownPin, LOW);
  if (up) digitalWrite(elevatorMotorUpPin, HIGH);
  if (down) digitalWrite(elevatorMotorDownPin, HIGH);
}

void updateDisplay() {
  digitalWrite(latchPin, LOW);
  shiftOut(dataPin, clockPin, MSBFIRST, NUM[currentFloor]);
  digitalWrite(latchPin, HIGH);
}

void addToQueue(int floor) {
  if (floor == currentFloor) return;
  for (int i = 0; i < queueSize; ++i)
    if (floorQueue[i] == floor) return;
  if (queueSize < MAX_QUEUE_SIZE) floorQueue[queueSize++] = floor;
}

void removeFromQueue(int floor) {
  for (int i = 0; i < queueSize; ++i) {
    if (floorQueue[i] != floor) continue;
    for (int j = i; j < queueSize - 1; ++j) floorQueue[j] = floorQueue[j + 1];
    --queueSize;
    return;
  }
}

int getNextFloor() {
  for (int pass = 0; pass < 2; ++pass) {
    for (int i = 0; i < queueSize; ++i)
      if ((direction == 1 && floorQueue[i] > currentFloor) ||
          (direction == -1 && floorQueue[i] < currentFloor)) return floorQueue[i];
    direction = -direction;
  }
  return floorQueue[0];
}

void finishMotorLeg(unsigned long now) {
  if (motorStartTime != 0) {
    motorElapsedTime += (now - motorStartTime) / 1000.0f;
    motorStartTime = 0;
  }
  if (sampleCount != 0) {
    // Preserve the project's existing current-to-power estimate.
    totalAvgCurrent += (currentSum / sampleCount) * 10.0f;
    currentSum = 0;
    sampleCount = 0;
  }
}

void handleStop(unsigned long now) {
  setMotor(false, false);
  digitalWrite(RDY, LOW);
  digitalWrite(ERR, HIGH);
  const bool hadSession = xEventGroupGetBits(sessionEvents) & SESSION_READY;
  xEventGroupSetBits(sessionEvents, STOP_ACTIVE);
  xEventGroupClearBits(sessionEvents, SESSION_READY);
  if (stopLatched) return;

  stopLatched = true;
  finishMotorLeg(now);
  moving = false;
  queueSize = 0;
  arrivalTime = 0;
  if (hadSession) {
    ExpenseReport report = {motorElapsedTime, totalAvgCurrent * 22.2f};
    // A full queue is a latched fault: do not silently discard an expense.
    if (xQueueSend(expenseQueue, &report, 0) != pdTRUE) reportFault = true;
  }
  motorElapsedTime = 0;
  totalAvgCurrent = 0;
  Serial.println("Emergency stop triggered");
}

void controlTask(void *) {
  TickType_t wake = xTaskGetTickCount();
  for (;;) {
    const unsigned long now = millis();
    if (digitalRead(STP) == HIGH) {
      handleStop(now);
      vTaskDelayUntil(&wake, CONTROL_PERIOD);
      continue;
    }
    stopLatched = false;
    xEventGroupClearBits(sessionEvents, STOP_ACTIVE);
    const bool authorized = !reportFault &&
      (xEventGroupGetBits(sessionEvents) & (SESSION_READY | SENSOR_READY)) ==
      (SESSION_READY | SENSOR_READY);
    digitalWrite(RDY, authorized ? HIGH : LOW);
    if (!authorized) {
      setMotor(false, false);
      if (moving) finishMotorLeg(now);
      moving = false;
      queueSize = 0;
      vTaskDelayUntil(&wake, CONTROL_PERIOD);
      continue;
    }
    digitalWrite(ERR, LOW);

    if (now - lastButtonCheck >= 200) {
      for (int i = 0; i < 4; ++i) {
        if (digitalRead(buttonPins[i]) == HIGH) {
          addToQueue(i);
          lastButtonCheck = now;
          break;
        }
      }
    }
    for (int i = 0; i < 4; ++i) {
      if (digitalRead(irSensorPins[i]) != HIGH) continue;
      if (moving && i == targetFloor) {
        setMotor(false, false);
        finishMotorLeg(now);
        moving = false;
        currentFloor = i;
        removeFromQueue(i);
        arrivalTime = now;
        updateDisplay();
      } else if (!moving && currentFloor != i) {
        currentFloor = i;
        updateDisplay();
      }
      break;
    }

    if (moving) {
      // Sensor I2C stays in another task, so a slow transaction cannot hold
      // the motor task away from STOP.
      float currentAmps;
      if (xQueueReceive(currentQueue, &currentAmps, 0) == pdTRUE) {
        currentSum += currentAmps;
        ++sampleCount;
      }
    } else if (queueSize > 0 && (arrivalTime == 0 || now - arrivalTime >= 2000)) {
      targetFloor = getNextFloor();
      if (targetFloor == currentFloor) {
        removeFromQueue(targetFloor);
      } else {
        moving = true;
        motorStartTime = now;
        setMotor(targetFloor > currentFloor, targetFloor < currentFloor);
      }
    }
    vTaskDelayUntil(&wake, CONTROL_PERIOD);
  }
}

void sensorTask(void *) {
  Wire.begin(I2C[0], I2C[1]);
  Wire.setTimeOut(20);
  for (;;) {
    if (!currentSensor.begin(INA228_I2CADDR_DEFAULT, &Wire)) {
      xEventGroupClearBits(sessionEvents, SENSOR_READY);
      Serial.println("INA228 not found");
      vTaskDelay(NETWORK_RETRY);
      continue;
    }
    currentSensor.setShunt(SHUNT_RESISTANCE_OHMS, MAX_CURRENT_A);
    xEventGroupSetBits(sessionEvents, SENSOR_READY);
    for (;;) {
      const float currentAmps = currentSensor.getCurrent_mA() / 1000.0f;
      xQueueOverwrite(currentQueue, &currentAmps);
      vTaskDelay(CONTROL_PERIOD);
    }
  }
}

bool postJson(const char *url, const String &payload) {
  HTTPClient http;
  http.setTimeout(2000);
  if (!http.begin(url)) return false;
  http.addHeader("Content-Type", "application/json");
  const int status = http.POST(payload);
  const bool success = status == 200 && http.getString() == "OK";
  http.end();
  return success;
}

void networkTask(void *) {
  ExpenseReport pending = {};
  bool havePending = false;
  for (;;) {
    // Expense creation consumes the current backend session.
    if (!havePending && xQueueReceive(expenseQueue, &pending, 0) == pdTRUE) {
      havePending = true;
      xEventGroupClearBits(sessionEvents, SESSION_READY);
    }
    if (WiFi.status() != WL_CONNECTED) {
      WiFi.reconnect();
      vTaskDelay(NETWORK_RETRY);
      continue;
    }
    if (havePending) {
      const String payload = String("{\"time\":") + String(pending.seconds, 3) +
        ",\"power\":" + String(pending.power, 2) +
        ",\"brain\":\"" + BRAIN_CODE + "\",\"mid\":\"" + MID + "\"}";
      if (postJson(EXPENSE_URL, payload)) {
        havePending = false;
        Serial.println("Expense submitted");
      } else {
        vTaskDelay(NETWORK_RETRY);
      }
      continue;
    }
    if (!(xEventGroupGetBits(sessionEvents) & SESSION_READY)) {
      const String payload = String("{\"brain\":\"") + BRAIN_CODE +
        "\",\"mid\":\"" + MID + "\"}";
      if (postJson(SESSION_URL, payload)) {
        // The stop may have arrived during the HTTP request.
        if (uxQueueMessagesWaiting(expenseQueue) == 0 &&
            !(xEventGroupGetBits(sessionEvents) & STOP_ACTIVE))
          xEventGroupSetBits(sessionEvents, SESSION_READY);
        else
          vTaskDelay(NETWORK_RETRY);
      } else {
        vTaskDelay(NETWORK_RETRY);
      }
    } else {
      vTaskDelay(pdMS_TO_TICKS(50));
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PWR, OUTPUT);
  pinMode(ERR, OUTPUT);
  pinMode(RDY, OUTPUT);
  pinMode(elevatorMotorUpPin, OUTPUT);
  pinMode(elevatorMotorDownPin, OUTPUT);
  pinMode(STP, INPUT);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
  for (int i = 0; i < 4; ++i) {
    pinMode(buttonPins[i], INPUT);
    pinMode(irSensorPins[i], INPUT);
  }
  setMotor(false, false);
  digitalWrite(PWR, HIGH);
  digitalWrite(ERR, LOW);
  digitalWrite(RDY, LOW);
  updateDisplay();

  expenseQueue = xQueueCreate(1, sizeof(ExpenseReport));
  currentQueue = xQueueCreate(1, sizeof(float));
  sessionEvents = xEventGroupCreate();
  if (!expenseQueue || !currentQueue || !sessionEvents ||
      xTaskCreate(controlTask, "elevator", 4096, nullptr, 4, nullptr) != pdPASS) {
    Serial.println("Failed to start elevator task");
    digitalWrite(ERR, HIGH);
    return;
  }
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  if (xTaskCreate(sensorTask, "ina228", 4096, nullptr, 2, nullptr) != pdPASS) {
    Serial.println("Failed to start sensor task");
    digitalWrite(ERR, HIGH);
  }
  if (xTaskCreate(networkTask, "network", 8192, nullptr, 1, nullptr) != pdPASS) {
    Serial.println("Failed to start network task");
    digitalWrite(ERR, HIGH);
  }
}

void loop() {
  vTaskDelay(pdMS_TO_TICKS(1000));
}
