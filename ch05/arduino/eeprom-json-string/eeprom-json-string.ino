#include <EEPROM.h>
#include <ArduinoJson.h>

enum ParseResult {PARSE_SUCCESS, 
  PARSE_ERROR};

const int configAddress = 0;
const int MAX_NUM_FANS = 10;
//char incomingMsg[256];
String incomingMsg = "";
int msgIndex = 0;
StaticJsonBuffer<512> jsonBuffer;

int * fanPins = 0;
int numFans = 0;
int interval = 20;

void setup() {
  Serial.begin(9600); 
  msgIndex = 0;
  loadConfig();
}

void loop() {
  while(Serial.available()) {
    char c = Serial.read();
    Serial.println(incomingMsg);
    if (c == '\r' || c=='\n') {
      Serial.print("user entered: ");
      Serial.println(incomingMsg);
      Serial.println("going to parse this"); 
      //incomingMsg[msgIndex++] = '\n';
      //incomingMsg[msgIndex++] = '\0';
      incomingMsg += '\n';
      //if (PARSE_SUCCESS == parseJson(incomingMsg)) {
      if (PARSE_SUCCESS == parseJson(incomingMsg.c_str())) {
        dumpConfig();
      }
      //msgIndex = 0;
      incomingMsg = "";
    }
    else {
      //incomingMsg[msgIndex++] = c;
      incomingMsg += c;
    }
  }
}
// {"fans":[2,3,2,5,4]}
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
    if (fanPins) {
     delete[] fanPins;
    }
    numFans = fansConfig.size();
    fanPins = new int[numFans]; 
    for (int i = 0; i < numFans; ++i) {
     fanPins[i] = fansConfig[i];
    }
  }
  
  if (root.containsKey("interval")) {
    Serial.println("got interval");
    interval = root["interval"];
  }

  return PARSE_SUCCESS;
}

void dumpConfig() {
  Serial.println("serializing");
  JsonObject& root = jsonBuffer.createObject();
  root["interval"] = interval;
  
  JsonArray& fanConfig = jsonBuffer.createArray();
  for (int i = 0; i < numFans; ++i) {
    fanConfig.add(fanPins[i]);
  }
  root["fans"] = fanConfig;

  char s[512];
  root.printTo(s);
  Serial.print("writing: ");
  Serial.println(s);
  EEPROM.put(configAddress, s);
  char t[512];
  EEPROM.get(configAddress, t);
  Serial.print("verify: ");
  Serial.println(t);
  
}

void loadConfig() {
  char s[512];
  EEPROM.get(configAddress, s); 
  Serial.print("reading: ");
  Serial.println(s);
  parseJson(s);
  printConfig();
}

void printConfig() {
  char str[50];
  sprintf(str, "interval: %d", interval);
  Serial.println(str);
  for (int i = 0; i < numFans; ++i) {
    sprintf(str, "fan %d: %d", i, fanPins[i]);
    Serial.println(str);
  }
}
