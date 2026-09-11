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

The wheelchair continuously monitors important safety conditions using computer vision, sensors, and embedded control.

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
<img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/NEURONIX.png" width="300">
</a>

</p>

> Click the **NEURONIX logo** to explore project demonstrations, testing scenarios, and autonomous navigation experiments.

---

# 🧩 System Architecture

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/System%20Architecture.jpeg" width="850">
</p>

The system architecture integrates the wheelchair's **AI, Computer Vision, Autonomous Navigation, Embedded Control, Backend, Database, and User Interface** into a unified intelligent mobility platform.

The architecture is built around the **NVIDIA Jetson Orin Nano** for high-level AI and perception, while the **ESP32** handles low-level real-time control and communication with the wheelchair's drive system.

The complete system is organized into:

- 🧠 **AI & Computer Vision**
- 🤖 **Autonomous Navigation**
- 🔌 **Embedded Control**
- 🌐 **Backend & Database**
- 🖥️ **User Dashboard**
- ⚙️ **Motor & Hardware Control**

---

## Hardware Components

The Autonomous Wheelchair combines **Edge AI computing, embedded control, motor systems, multi-camera perception, ultrasonic sensing, IMU-based motion feedback, and a dedicated user interface** into an integrated assistive mobility platform.

### 🧠 AI & Processing Unit

- **NVIDIA Jetson Orin Nano 8GB** — Main AI and computing platform
- **SSD Storage** — System, models, and application storage
- **7-inch Touchscreen** — Main user interface and dashboard

### 🔌 Embedded Control

- **ESP32** — Low-level real-time controller
- **Motor Drivers** — Motor speed and direction control
- **Embedded Communication** — Communication between the Jetson Orin Nano and the ESP32

### ⚙️ Drive System

- **2 × ZD101ZA1 Motors**
- **250W per motor**
- **24V**
- **160 RPM**
- **24V / 12Ah Lithium Battery**

### 📷 Vision & Sensors

The wheelchair uses a **three-camera vision system** combined with ultrasonic sensors and an IMU to provide environmental perception, user monitoring, and motion awareness.

#### Three-Camera System

- **Front Camera** — Primary camera facing forward for environment perception, object detection, obstacle detection, and autonomous navigation.
- **Rear Camera** — Monitors the area behind the wheelchair and supports rear-side awareness and safe movement.
- **User-Facing Camera** — Monitors the user for face recognition, drowsiness detection, head-pose estimation, and safety-related analysis.

#### Distance & Motion Sensors

- **6 × Ultrasonic Sensors** — 360° proximity and obstacle-distance monitoring around the wheelchair.
- **IMU (Inertial Measurement Unit)** — Provides motion and orientation data to support navigation, movement monitoring, and system awareness.

### 🖥️ User Interface & Dashboard

The wheelchair features a dedicated **7-inch touchscreen dashboard** that serves as the primary user interface for interacting with and monitoring the system.

The dashboard provides:

- 👤 **User Profile & Recognition**
- 🤖 **Manual / Autonomous Mode Selection**
- 🗺️ **Navigation Map & Route Information**
- 📍 **Destination Selection**
- 🎮 **Manual Wheelchair Control**
- 🚀 **Real-Time Speed Monitoring**
- 🛡️ **Safety & Obstacle Status**
- 📷 **Camera & Perception Status**
- 🔋 **System & Battery Information**
- 📡 **Real-Time System Monitoring**
- ⚙️ **Wheelchair Operating Status**

The dashboard connects the user with the wheelchair's **AI, navigation, safety, and embedded control systems**, providing a centralized interface for both operation and system monitoring.
