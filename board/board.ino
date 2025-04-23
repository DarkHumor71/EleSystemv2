#include <WiFi.h>
#include <HTTPClient.h>

// Wi-Fi credentials
const char* ssid = "hotcold1";
const char* password = "Mirna2016";



void sendDataToServer( float value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return;
  }

  HTTPClient http;

  String url = "http://192.168.1.106:5000/api/expense/create";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"time\":" + String(value, 2) + ",\"brain\":\"P6p8h3uD&JQNWh\"}";

  int httpResponseCode = http.POST(payload);

  Serial.print("HTTP Response Code: ");
  Serial.println(httpResponseCode);
  
  http.end();
}

void handleRunMotor() {
  
  sendDataToServer(50);
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


  Serial.println("HTTP server started");
}

void loop() {
HTTPClient http;

  String url = "http://192.168.1.106:5000/api/apartment/session";
  http.begin(url);

  
  int httpResponseCode = http.GET();

  Serial.print("HTTP Response Code: ");
  Serial.println(httpResponseCode);
  String response = http.getString();
  if (response== "OK") handleRunMotor();
  http.end();
  delay(1000);
}
