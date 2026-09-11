# ♿ Autonomous Wheelchair

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/MAVERICK" width="550">
</p>

<p align="center">
  <b>AI-Powered Autonomous Wheelchair for Intelligent, Safe, and Assistive Mobility</b>
</p>

---

## 📌 About The Project

**Autonomous Wheelchair** is an AI-powered smart mobility system designed to assist wheelchair users through **autonomous navigation, computer vision, embedded control, and intelligent safety monitoring**.

The system combines an **NVIDIA Jetson Orin Nano**, **ESP32**, **ROS 2**, and multiple AI/CV modules to provide both **manual and autonomous operation** while continuously monitoring the surrounding environment and the user's safety.

The project was developed as a graduation project with a focus on integrating:

- 🤖 Autonomous Robotics
- 👁️ Computer Vision
- 🧠 Edge AI
- 🔌 Embedded Systems
- 🗺️ Autonomous Navigation
- 🛡️ Intelligent Safety
- 🌐 Web-Based Control & Monitoring

---

## 🚀 Features

### 🤖 Autonomous Navigation
- Autonomous movement and navigation
- Real-time environmental perception
- Obstacle detection and avoidance
- Navigation based on predefined destinations
- ROS 2-based robotic control

### 👁️ Computer Vision

- Object detection using **YOLOv8**
- Face recognition using **DeepFace / FaceNet**
- Drowsiness detection
- Head-pose monitoring
- Seatbelt detection
- Floor/sign detection
- Real-time camera-based environmental understanding

### 🧑‍🦽 User Assistance

- User recognition
- Personalized user profiles
- Manual driving mode
- Autonomous driving mode
- Destination selection
- Real-time system status

### 🛡️ Safety System

The wheelchair continuously monitors important safety conditions and can use computer vision and sensor feedback to detect potentially unsafe situations.

Safety-related capabilities include:

- Obstacle detection
- Drowsiness monitoring
- Seatbelt monitoring
- Environmental awareness
- Emergency/manual intervention
- Real-time system monitoring

---

## 🎥 Project Demo

<p align="center">

<a href="https://youtu.be/qC3RIVg91yc">
<img src="https://img.youtube.com/vi/ZktnqMIp0q0/0.jpg" width="300">
</a>

</p>

> Project demonstration videos, testing scenarios, and autonomous navigation experiments will be added here.

---

## 🧠 AI & Computer Vision

The wheelchair uses Edge AI to perform real-time computer vision directly on the onboard computing platform.

### Object Detection

**YOLOv8n** is used for lightweight real-time object detection while maintaining a balance between inference speed and detection performance.

### Face Recognition

The system uses:

- DeepFace
- FaceNet-based embeddings
- User identification

This allows the wheelchair to recognize registered users and associate them with their personalized profiles.

### Drowsiness Detection

The drowsiness monitoring system combines visual indicators such as:

- Eye Aspect Ratio (EAR)
- Mouth Aspect Ratio (MAR)
- Head Pose

These signals can be used together to estimate whether the user is becoming drowsy.

### Safety Detection

Computer vision modules are also used for:

- Seatbelt detection
- Floor/sign recognition
- Environmental object detection

---

## 🤖 Autonomous Navigation

The autonomous mobility stack is built around **ROS 2 Humble**.

The navigation architecture is responsible for connecting perception, decision-making, and low-level motor control.

### Navigation Pipeline

```text
Cameras / Sensors
       │
       ▼
Computer Vision
       │
       ▼
Environment Perception
       │
       ▼
Navigation / Decision Making
       │
       ▼
ROS 2 Control Layer
       │
       ▼
ESP32
       │
       ▼
Motor Drivers
       │
       ▼
Wheelchair Motors
