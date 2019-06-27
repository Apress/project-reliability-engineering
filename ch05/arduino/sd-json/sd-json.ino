//#include <EEPROM.h>

#include <SD.h>
#include <ArduinoJson.h>

const int sdChipSelect = 4;

enum ParseResult {
  PARSE_SUCCESS, 
  PARSE_ERROR
};

const int configAddress = 0;
const int MAX_NUM_FANS = 10;
char incomingMsg[256];
int msgIndex = 0;

int * fanPins = 0;
int numFans = 0;
int interval = 20;

void setup() {
  Serial.begin(9600); 
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("started");
  if (!SD.begin(sdChipSelect)) {
    Serial.println("sd card error");
    while(1);
  }
  msgIndex = 0;
  Serial.println("sd card open");
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
  StaticJsonBuffer<256> jsonBuffer;
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
  StaticJsonBuffer<256> jsonBuffer;
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
  SD.remove("config.jsn");
  File configFile = SD.open("config.jsn", FILE_WRITE);
  configFile.println(s);
  configFile.close();
}

void loadConfig() {
  File configFile = SD.open("config.jsn");
  if (!configFile) {
    Serial.println("error opening file");
  }
  char s[512];
  configFile.read(s, 512);
  configFile.close();
  int i = 0;
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
