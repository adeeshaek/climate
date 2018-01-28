#include <ESP8266WiFi.h>
#include <Wire.h>
#include <SDL_ESP8266_HR_AM2315.h>

#if 1
__asm volatile ("nop");
#endif

// Board options

#pragma GCC diagnostic ignored "-Wwrite-strings"

extern "C" {
#include "user_interface.h"
}

const char* ssid = "";
const char* password = "";//type your password

SDL_ESP8266_HR_AM2315 am2315;
float dataAM2315[2];  //Array to hold data returned by sensor.  [0,1] => [Humidity, Temperature]
boolean readOk;  // 1=successful read

int ledPin = 2; // GPIO2 of ESP8266
int pinDHT11 = 2;

WiFiServer server(80);//Service Port
 
void setup() {
  Serial.begin(115200);
  delay(10);
 
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
   
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
   
  WiFi.begin(ssid, password);
   
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
   
  // Start the server
  server.begin();
  Serial.println("Server started");
 
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}

void response(WiFiClient client, int value) {
    // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println(""); //  do not forget this one
  client.println("<!DOCTYPE HTML>");
  client.println("<html>");
   
  client.print("Led pin is now: ");
   
  if(value == HIGH) {
    client.print("On");  
  } else {
    client.print("Off");
  }
  client.println("<br><br>");
  client.println("Click <a href=\"/LED=ON\">here</a> turn the LED on pin 2 ON<br>");
  client.println("Click <a href=\"/LED=OFF\">here turn the LED on pin 2 OFF<br>");
  client.println("</html>");
 
  Serial.println("Client disconnected");
  Serial.println("");
}

void tempResponse(WiFiClient client) {
    // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println(""); //  do not forget this one
  
  client.println("{");
  client.print(" \"temperature\": ");
  client.print(dataAM2315[1]);
  client.print(", ");
  client.println(" \"humidity\": ");
  client.print(dataAM2315[0]);
  client.println("}");
}

void wifiLoop() {
    // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
   
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
   
  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();
   
  // Match the request
  int value = LOW;
  if (request.indexOf("/LED=ON") != -1) {
    digitalWrite(ledPin, LOW);
    value = LOW;
    response(client, value);
  } 
  
  if (request.indexOf("/LED=OFF") != -1){
    digitalWrite(ledPin, HIGH);
    value = HIGH;
    response(client, value);
  }

  if (request.indexOf("/tmp") != -1) {
    readOk = am2315.readData(dataAM2315);
  
    if (readOk) {
      Serial.print("Hum: "); Serial.println(dataAM2315[0]);
      Serial.print("TempF: "); Serial.println(dataAM2315[1]);
    }
   
    tempResponse(client);
  }
 
  //Set ledPin according to the request
  //digitalWrite(ledPin, value);
}
 
void loop() {
  wifiLoop();

  delay(1);
}
