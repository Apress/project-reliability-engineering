#include <EEPROM.h>
#include <ArduinoJson.h>

char configBuffer[256];
const int configAddress = 0;
const int MAX_NUM_FANS = 10;
String incomingMsg = "";
StaticJsonBuffer<512> jsonBuffer;

struct GeneralConfig {
  int measuringInterval;
  int * fanPins;
  int numFans;
} cfg;

void setup() {
  Serial.begin(9600); 
  EEPROM.get(configAddress, cfg); 
  printConfig();
}

void loop() {
  while(Serial.available()) {
    char c = Serial.read();
    incomingMsg += c;
    if (c == 10) {
      Serial.println(incomingMsg);
      Serial.println(sizeof(incomingMsg));
      parseJson(incomingMsg);
      incomingMsg = "";
    }
  }
}

void parseJson(String s) {
  JsonObject& root = jsonBuffer.parseObject(s);
  if (!root.success()) {
    Serial.println("parsing failed");
    return;
  }
  
  JsonArray& fansConfig = root["fans"];
  cfg.fanPins = new int[fansConfig.size()]; 
  cfg.numFans = fansConfig.size(); 
  for (int i = 0; i < cfg.numFans; ++i) {
    cfg.fanPins[i] = fansConfig[i];
  }
  printConfig();
  EEPROM.put(configAddress, cfg); 
}

void printConfig() {
  for (int i = 0; i < cfg.numFans; ++i) {
    char str[50];
    sprintf(str, "fan %d: %d", i, cfg.fanPins[i]);
    Serial.println(str);
  }
  Serial.println(sizeof(cfg));
}
