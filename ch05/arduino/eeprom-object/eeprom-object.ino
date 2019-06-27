#include <EEPROM.h>
#include <ArduinoJson.h>

enum ParseResult {
  PARSE_SUCCESS, 
  PARSE_ERROR
};

const int configAddress = 0;
const int MAX_NUM_FANS = 10;
char incomingMsg[256];
int msgIndex = 0;
StaticJsonBuffer<512> jsonBuffer;

struct Configuration {
  int interval = 20;
  int fanPins[MAX_NUM_FANS];
  int numFans = 0;
} cfg;


void setup() {
  Serial.begin(9600); 
  msgIndex = 0;
  loadConfig();
}

void loop() {
  while(Serial.available()) {
    char c = Serial.read();
    //incomingMsg += c;
    Serial.println(incomingMsg);
    if (c == '\r' || c=='\n') {
      incomingMsg[msgIndex++] = '\n';
      incomingMsg[msgIndex++] = '\0';
      Serial.print("user entered: ");
      Serial.println(incomingMsg);
      Serial.println("going to parse this"); 
      if (PARSE_SUCCESS == parseJson(incomingMsg)) {
      //if (PARSE_SUCCESS == parseJson(incomingMsg.c_str())) {
        dumpConfig();
      }
      msgIndex = 0;
      //incomingMsg = "";
    }
    else {
      incomingMsg[msgIndex++] = c;
    }
  }
}

ParseResult parseJson(const char* s) {
  Serial.println("parsing");
  JsonObject& root = jsonBuffer.parseObject(s);
  if (!root.success()) {
    Serial.println("parsing failed");
    return PARSE_ERROR;
  }

  JsonArray& fansConfig = root["fans"];
  if (fansConfig.success()) {
    Serial.println("got fans");
    cfg.numFans = fansConfig.size();
    for (int i = 0; i < cfg.numFans; ++i) {
     cfg.fanPins[i] = fansConfig[i];
    }
  }
  
  if (root.containsKey("interval")) {
    Serial.println("got interval");
    cfg.interval = root["interval"];
  }
  printConfig();
  return PARSE_SUCCESS;
}

void printConfig() {
  Serial.println("printing config");
  char str[50];
  sprintf(str, "interval: %d", cfg.interval);
  Serial.println(str);
  for (int i = 0; i < cfg.numFans; ++i) {
    sprintf(str, "fan %d: %d", i, cfg.fanPins[i]);
    Serial.println(str);
  }
}

void loadConfig() {
  EEPROM.get(configAddress, cfg);
  printConfig();
}

void dumpConfig() {
  EEPROM.put(configAddress, cfg);
}
