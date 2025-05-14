#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32QRCodeReader.h>

// Wi-Fi credentials
const char* ssid = "hotcold1";
const char* password = "Mirna2016";
const String MID ="ELE1";

// URLs
const char* validationServerUrl = "http://192.168.1.103:5000/api/apartment/exists";

// QR Reader setup
ESP32QRCodeReader reader(CAMERA_MODEL_AI_THINKER);
String lastID = "";

// === QR Task ===
void onQrCodeTask(void *pvParameters) {
  struct QRCodeData qrCodeData;
  unsigned long lastScanTime = 0;
  const unsigned long scanCooldown = 5000; // 5 seconds

  while (true) {
    if (reader.receiveQrCode(&qrCodeData, 100)) {
      Serial.println("Scanned new QRCode");

      if (qrCodeData.valid) {
        String payload = String((const char *)qrCodeData.payload);
        payload.trim();

        unsigned long currentTime = millis();

        if (payload == lastID && (currentTime - lastScanTime < scanCooldown)) {
          Serial.println("Duplicate scan ignored (within 5 seconds)");
        } else {
          lastID = payload;
          lastScanTime = currentTime;

          Serial.print("Valid QR payload: ");
          Serial.println(payload);
          sendIDToServer(payload);
        }
      } else {
        Serial.print("Invalid payload: ");
        Serial.println((const char *)qrCodeData.payload);
      }
    }

    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}


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
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup QR reader
  reader.setup();
  reader.beginOnCore(1);
  Serial.println("QR Reader initialized on Core 1");

  // Start QR scanning task
  xTaskCreate(onQrCodeTask, "onQrCode", 4 * 1024, NULL, 4, NULL);
}

void loop() {
  delay(5000); // Idle loop
}

void sendIDToServer(String id) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Validate ID with main server
    http.begin(validationServerUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["id"] = id;

    doc["mid"]= MID;

    String payload;
    serializeJson(doc, payload);
    Serial.println("Sending JSON to validation server: " + payload);

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println("Validation Server Response: " + response);

      if (response == "OK") {
        Serial.println("Server acknowledged ID.");

      } else {
        Serial.println("Server did not respond with 'OK'.");
      }
    } else {
      Serial.print("Error sending POST to validation server: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected.");
  }
}
