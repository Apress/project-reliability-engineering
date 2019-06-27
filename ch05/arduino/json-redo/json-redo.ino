#include <EEPROM.h>


const int configAddress = 0;
char incomingMsg[256];
char readBuff[256];
int msgIndex = 0;

void setup() {
  Serial.begin(9600); 
  Serial.flush();
  EEPROM.get(configAddress, readBuff); 
  Serial.print("reading: ");
  Serial.println(readBuff);
}

void loop() {
  while(Serial.available()) {
    char c = Serial.read();
    incomingMsg[msgIndex++] = c;
    if (c == 10) {
      Serial.print("user entered: ");
      incomingMsg[msgIndex] = '\0';
      Serial.println(incomingMsg);
      EEPROM.put(configAddress, incomingMsg);
      msgIndex = 0;
      EEPROM.get(configAddress, readBuff); 
      Serial.print("reading: ");
      Serial.println(readBuff);
    }
  }
}
