// Adafruit_NeoMatrix example for single NeoPixel Shield.
// Scrolls 'Howdy' across the matrix in a portrait (vertical) orientation.

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include <Fonts/Picopixel.h>
#ifndef PSTR
#define PSTR // Make Arduino Due happy
#endif

#include <NTPClient.h>
// get time
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
// #include <WiFiServer.h>
#include <WiFiUdp.h>
// #include <WiFi.h>
// #include <WiFiClient.h>
// connect wifi
#include <FastLED.h>

#define PIN 2

// 热点
//const char *ssid     = "LED";
//const char *password = "00000000";
// 宿舍
const char *ssid     = "405";
const char *password = "03345168";
//// 实验室
//const char *ssid     = "C405";
//const char *password = "C405C405";
// 社团
//const char *ssid     = "MERCURY_BE4A";
//const char *password = "qwerzxcv103";

// unused frequency
String unfre = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(19, 7, PIN,
                            NEO_MATRIX_TOP     + NEO_MATRIX_RIGHT +
                            NEO_MATRIX_COLUMNS + NEO_MATRIX_PROGRESSIVE,
                            NEO_GRB            + NEO_KHZ800);

// NTP prepare
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "ntp1.aliyun.com", 60 * 60 * 8, 30 * 60 * 1000);

const uint16_t colors[] = {
  matrix.Color(random(0, 256), random(0, 256), random(0, 256)),
  matrix.Color(random(0, 256), random(0, 256), random(0, 256)),
  matrix.Color(random(0, 256), random(0, 256), random(0, 256)),
};

// set flag
unsigned char flag_colon = 0, flag_board = 0, flag_time = 0, flag_blink = 0;

ESP8266WebServer server(5000);

void setup() {
  init_matrix();
  init_nettime();
  init_web();
}

unsigned long start_time = millis();

void loop() {
  if ((millis() - start_time) >= 1000 && !flag_time)
  {
    show_time();
    flag_colon = ~flag_colon;
    start_time = millis();
  }
  if (flag_time)
  {
    matrix.fillScreen(0);
  }
  server.handleClient();
}

void init_matrix()
{
  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(50);
  matrix.setTextColor(matrix.Color(220, 180, 100));
  matrix.setFont(&Picopixel);
  matrix.setTextSize(1);
  matrix.fillScreen(0);
}

void init_nettime()
{
  Serial.begin(115200);
  while (Serial.available()) {
      Serial.println("Clearing Serial Incoming Buffer.");
      Serial.read();
  }
  Serial.println("");
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }
  Serial.println( "sucess" );
  timeClient.begin();
}

void init_web()
{
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  //初始化WebServer
  server.on("/", handleRoot);
  server.begin();
  // Serial.println("HTTP server started");
}

void handleRoot() {
  // Serial.println("用户访问了主页");
  if (server.hasArg("analyzer"))
  {
    server.send(200);
    if (!((server.arg("analyzer")).equals(unfre)))
    {
      flag_time = 1;
      show_fre(server.arg("analyzer"));
      Serial.println(flag_time);
    }
    Serial.flush();
    // Serial.println(server.arg("analyzer"));
  }
  if (server.hasArg("time"))
  {
    server.send(200);
    if (flag_time)
    {
      flag_time = 0;
    } else {
      flag_time = 1;
    }
    Serial.println(flag_time);
  }
  if (server.hasArg("exit"))
  {
    server.send(200);
    flag_time = 0;
    // Serial.println(server.arg("time"));
    Serial.println(flag_time);
    while (Serial.available()) {
      Serial.println("Clearing Serial Incoming Buffer.");
      Serial.read();
    }
  }
  if (server.hasArg("board"))
  {
    server.send(200);
    flag_board = ~flag_board;
    // Serial.println(server.arg("board"));
    Serial.println(flag_board);
  }
  if (server.hasArg("blink"))
  {
    server.send(200);
    flag_blink = ~flag_blink;
    // Serial.println(server.arg("blink"));
    Serial.println(flag_blink);
  }
}

void show_fre(String fre_str)
{
  String s;
  int ib;
  float fre[32];
  // Serial.println(" ");
  for (int i = 0; i < 32; i++)
  {
    ib = fre_str.indexOf(",");
    if (ib == 1)
    {
      s = fre_str.charAt(0);
    } else {
      s = fre_str.substring(0, ib);
    }
    // Serial.print("s=");
    // Serial.println(s);
    if (i < 3 || i >=30 || (i % 2 == 0))
    {
      fre[i] = s.toFloat();
    }
    fre_str.remove(0, ib + 1);
  }
  cal_fre(fre);
  if (flag_time)
  {
    matrix.show();
  }
}

void cal_fre(float fre[32])
{
  randomSeed(random(0,1000));
  matrix.drawLine(0, 6, 0, 6 - round((fre[0] / 255) * 6), matrix.Color(random(0, 75) * (fre[0] / 255), 255 * (fre[0] / 255), random(105) * (fre[0] / 255)));
  matrix.drawLine(1, 6, 1, 6 - round((fre[2] / 255) * 6), matrix.Color(random(0, 85) * (fre[0] / 255), 255 * (fre[0] / 255), random(95) * (fre[0] / 255)));
  matrix.drawLine(2, 6, 2, 6 - round((fre[8] / 255) * 6), matrix.Color(random(0, 105) * (fre[0] / 255), 255 * (fre[0] / 255), random(75) * (fre[0] / 255)));
  matrix.drawLine(3, 6, 3, 6 - round((fre[12] / 255) * 6), matrix.Color(random(0, 105) * (fre[0] / 255), 255 * (fre[0] / 255), random(105) * (fre[0] / 255)));
  matrix.drawLine(4, 6, 4, 6 - round((fre[20] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(105) * (fre[0] / 255)));
  matrix.drawLine(5, 6, 5, 6 - round((fre[22] / 255) * 6), matrix.Color(random(0, 95) * (fre[0] / 255), 255 * (fre[0] / 255), random(85) * (fre[0] / 255)));
  matrix.drawLine(6, 6, 6, 6 - round((fre[24] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(110, 255)));
  matrix.drawLine(7, 6, 7, 6 - round((fre[18] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(110, 255)));
  matrix.drawLine(8, 6, 8, 6 - round((fre[22] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(110, 255)));
  matrix.drawLine(9, 6, 9, 6 - round((fre[16] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(110, 255)));
  matrix.drawLine(10, 6, 10, 6 - round((fre[30] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(110, 255)));
  matrix.drawLine(11, 6, 11, 6 - round((fre[26] / 255) * 6), matrix.Color(200 * (fre[0] / 255), random(0, 105) * (fre[0] / 255), random(0, 200) * (fre[0] / 255)));
  matrix.drawLine(12, 6, 12, 6 - round((fre[14] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(13, 6, 13, 6 - round((fre[10] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(14, 6, 14, 6 - round((fre[21] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(15, 6, 15, 6 - round((fre[28] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(16, 6, 16, 6 - round((fre[10] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(17, 6, 17, 6 - round((fre[5] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
  matrix.drawLine(18, 6, 18, round((fre[2] / 255) * 6), matrix.Color(random(100, 230), 255 * (fre[0] / 255), random(0, 200)));
}

void show_time()
{
  randomSeed(random(0,1000));
  int hour, minute;
  timeClient.update();
  hour = timeClient.getHours();
  minute = timeClient.getMinutes();

  matrix.fillScreen(0);
  matrix.setCursor(1, 5);
  String str;
  if (!flag_colon)
    str = String(hour / 10) + String(hour % 10) + ":" + String(minute / 10) + String(minute % 10);
  else
    str = String(hour / 10) + String(hour % 10) + " " + String(minute / 10) + String(minute % 10);
  if (!flag_board && !flag_blink)
  {
    matrix.drawLine(0, 0, 0, 6, matrix.Color(random(0, 100), random(0, 256), random(0, 256)));
    matrix.drawLine(18, 0, 18, 6, matrix.Color(random(0, 100), random(0, 100), random(0, 256)));
    matrix.drawLine(1, 0, 17, 0, matrix.Color(random(0, 100), random(0, 256), random(0, 100)));
    matrix.drawLine(1, 6, 17, 6, matrix.Color(random(0, 150), random(0, 50), random(0, 50)));
  } else if (!flag_board && flag_blink) {
    matrix.drawLine(0, 0, 0, 6, colors[0]);
    matrix.drawLine(18, 0, 18, 6, colors[0]);
    matrix.drawLine(1, 0, 17, 0, colors[1]);
    matrix.drawLine(1, 6, 17, 6, colors[1]);
  } else {
    matrix.drawLine(0, 0, 0, 6, matrix.Color(0, 0, 0));
    matrix.drawLine(18, 0, 18, 6, matrix.Color(0, 0, 0));
    matrix.drawLine(1, 0, 17, 0, matrix.Color(0, 0, 0));
    matrix.drawLine(1, 6, 17, 6, matrix.Color(0, 0, 0));
  }
  matrix.print(str);
  matrix.show();
}
