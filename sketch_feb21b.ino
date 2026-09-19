#include <Arduino.h>
#include <WiFi.h>

// ================== WIFI ==================
const char* ssid = "Robot_Car";
const char* password = "12345678";

WiFiServer server(80);

// ================== MOTOR PINS ==================
#define R_RPWM 25
#define R_LPWM 26
#define R_REN  27
#define R_LEN  14

#define L_RPWM 18
#define L_LPWM 19
#define L_REN  33
#define L_LEN  32

// ================== PWM ==================
const int PWM_FREQ = 20000;
const int PWM_RES = 8;

// ================== SPEED ==================
const int F_MAX = 150;
const int S_MAX = 80;

// ================== STATE ==================
int targetL = 0;
int targetR = 0;

int currentL = 0;
int currentR = 0;

// ================== HTML PAGE ==================
String page = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { text-align:center; font-family:Arial; background:#111; color:white; }
button {
  width:70px; height:70px;
  font-size:20px; margin:5px;
  border-radius:15px; border:none;
  background:#333; color:white;
}
button:active { background:#00ccff; }
</style>
</head>

<body>

<h2>🚗 Robot Controller</h2>

<div>
  <button onclick="send('q')">↖️</button>
  <button onclick="send('f')">⬆️</button>
  <button onclick="send('e')">↗️</button>
</div>

<div>
  <button onclick="send('l')">⬅️</button>
  <button onclick="send('s')">⏹</button>
  <button onclick="send('r')">➡️</button>
</div>

<div>
  <button onclick="send('z')">↙️</button>
  <button onclick="send('b')">⬇️</button>
  <button onclick="send('c')">↘️</button>
</div>

<script>
function send(cmd){
  fetch("/?cmd=" + cmd);
}
</script>

</body>
</html>
)rawliteral";

// ================== MOTOR ==================
void setMotor(int left, int right) {

  left = constrain(left, -255, 255);
  right = constrain(right, -255, 255);

  // LEFT
  if (left > 0) {
    ledcWrite(0, left);
    ledcWrite(1, 0);
  } else {
    ledcWrite(0, 0);
    ledcWrite(1, -left);
  }

  // RIGHT
  if (right > 0) {
    ledcWrite(2, right);
    ledcWrite(3, 0);
  } else {
    ledcWrite(2, 0);
    ledcWrite(3, -right);
  }
}

// ================== SETUP ==================
void setup() {

  Serial.begin(115200);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);
  server.begin();

  Serial.println("WiFi Ready ✔");
  Serial.println(WiFi.softAPIP());

  pinMode(R_REN, OUTPUT);
  pinMode(R_LEN, OUTPUT);
  pinMode(L_REN, OUTPUT);
  pinMode(L_LEN, OUTPUT);

  digitalWrite(R_REN, 1);
  digitalWrite(R_LEN, 1);
  digitalWrite(L_REN, 1);
  digitalWrite(L_LEN, 1);

  ledcSetup(0, PWM_FREQ, PWM_RES);
  ledcSetup(1, PWM_FREQ, PWM_RES);
  ledcSetup(2, PWM_FREQ, PWM_RES);
  ledcSetup(3, PWM_FREQ, PWM_RES);

  ledcAttachPin(R_RPWM, 0);
  ledcAttachPin(R_LPWM, 1);
  ledcAttachPin(L_RPWM, 2);
  ledcAttachPin(L_LPWM, 3);
}

// ================== LOOP ==================
void loop() {

  WiFiClient client = server.available();

  if (client) {

    while (client.connected() && !client.available()) {
      delay(1);
    }

    String req = client.readStringUntil('\r');

    // عرض الصفحة
    if (req.indexOf("GET / ") != -1) {
      client.println("HTTP/1.1 200 OK");
      client.println("Content-type:text/html");
      client.println();
      client.println(page);
    }

    // استقبال الأوامر
    if (req.indexOf("/?cmd=") != -1) {
      char cmd = req.charAt(req.indexOf("=") + 1);

      // أساسي
      if (cmd == 'f') { targetL = F_MAX; targetR = F_MAX; }
      else if (cmd == 'b') { targetL = -S_MAX; targetR = -S_MAX; }
      else if (cmd == 'l') { targetL = -S_MAX; targetR = S_MAX; }
      else if (cmd == 'r') { targetL = S_MAX; targetR = -S_MAX; }
      else if (cmd == 's') { targetL = 0; targetR = 0; }

      // 🔥 8 اتجاهات
      else if (cmd == 'q') { targetL = F_MAX/2; targetR = F_MAX; }
      else if (cmd == 'e') { targetL = F_MAX; targetR = F_MAX/2; }
      else if (cmd == 'z') { targetL = -S_MAX/2; targetR = -S_MAX; }
      else if (cmd == 'c') { targetL = -S_MAX; targetR = -S_MAX/2; }
    }

    client.stop();
  }

  // ===== Smooth movement =====
  if (currentL < targetL) currentL += 5;
  if (currentL > targetL) currentL -= 5;

  if (currentR < targetR) currentR += 5;
  if (currentR > targetR) currentR -= 5;

  setMotor(currentL, currentR);

  delay(10);
}
