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
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/System%20Architecture.png" width="850">
</p>

The system follows a modular architecture that integrates **AI, computer vision, robotics, embedded systems, backend services, and a user dashboard**.

### Main Architecture

```text
                    ┌────────────────────────────┐
                    │       Cameras / Sensors    │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │   NVIDIA Jetson Orin Nano  │
                    │           8 GB             │
                    │                            │
                    │   AI / Computer Vision      │
                    │   Navigation               │
                    │   User Recognition         │
                    │   Safety Monitoring         │
                    └─────────────┬──────────────┘
                                  │
                             ROS 2 Humble
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
                ▼                                   ▼
      ┌─────────────────────┐             ┌─────────────────────┐
      │      FastAPI        │             │        ESP32        │
      │   Backend / API     │             │  Embedded Control   │
      └──────────┬──────────┘             └──────────┬──────────┘
                 │                                   │
                 ▼                                   ▼
      ┌─────────────────────┐             ┌─────────────────────┐
      │   React Dashboard   │             │    Motor Drivers    │
      └──────────┬──────────┘             └──────────┬──────────┘
                 │                                   │
                 ▼                                   ▼
          ┌──────────────┐                   ┌─────────────────┐
          │   Supabase   │                   │ Wheelchair      │
          │   Database   │                   │ Motors          │
          └──────────────┘                   └─────────────────┘
