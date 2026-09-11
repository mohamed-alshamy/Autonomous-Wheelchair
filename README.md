# ♿ MAVERICK: AI-Powered Autonomous Wheelchair System

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/MAVERICK" width="650" alt="MAVERICK Banner">
</p>

<p align="center">
  <b>An Industrial-Grade, AI-Driven Autonomous Mobility Platform for Assistive Navigation, Edge Perception, and Biometric Safety</b>
</p>

<p align="center">
  <a href="https://docs.ros.org/en/humble/"><img src="https://img.shields.io/badge/ROS_2-Humble-blue.svg" alt="ROS 2"></a>
  <a href="https://developer.nvidia.com/embedded/jetson-orin-nano-developer-kit"><img src="https://img.shields.io/badge/Hardware-NVIDIA_Jetson_Orin_Nano_8GB-76B900.svg" alt="NVIDIA Jetson"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI-009688.svg" alt="FastAPI"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React_18-61DAFB.svg" alt="React"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"></a>
</p>

---

## 📌 Executive Summary & Architecture Overview

**Project MAVERICK** is a high-performance, edge-AI-driven autonomous mobility platform designed under **NEURONIX Intelligence**. Built to address complex assistive navigation challenges, MAVERICK merges high-level heterogeneous edge computing with low-level deterministic motor control.

The system features real-time spatial awareness, multi-camera perception, multi-modal biometric user monitoring, dynamic obstacle avoidance, and dynamic drive-mode execution (Manual / Autonomous).

Designed natively for the **NVIDIA Jetson Orin Nano (8GB)** running **ROS 2**, MAVERICK uses specialized hardware acceleration for deep learning pipelines and an **ESP32** microcontroller for real-time safety interlocks, sensor aggregation, and PWM actuation.

---

## 🚀 Key Features

* 🤖 **Autonomous Navigation & SLAM:** Dynamic path planning, localized costmap generation, dynamic obstacle avoidance, and predefined goal-point navigation via ROS 2.
* 👁️ **Multi-Camera Edge Vision:** Simultaneous multi-camera handling for forward spatial detection, rear collision monitoring, and user biometric state analysis.
* 🧠 **Real-Time Edge AI:** Hardware-accelerated inference for object detection, biometric identity verification, driver drowsiness, head pose, and seatbelt enforcement.
* 🔌 **Hardware-Level Safety Interlocks:** Multi-sensor spatial fusion (Ultrasonic array + IMU) integrated directly into the ESP32 low-level firmware for zero-latency emergency braking.
* 🖥️ **Dark-Robotics Telemetry Dashboard:** A sleek, high-refresh-rate web UI running on a 7-inch touchscreen for real-time controls, system metrics, and live stream overlays.

---

## 🎥 Project Demonstration

<p align="center">
  <a href="https://youtu.be/qC3RIVg91yc" target="_blank">
    <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/NEURONIX.png" width="350" alt="MAVERICK Demo">
  </a>
</p>

> 💬 **Click the NEURONIX logo above** to watch full operational demos, field trials, autonomous navigation tests, and safety interlock validations.

---

## 🧩 System Architecture

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/System%20Architecture.jpeg" width="900" alt="System Architecture Diagram">
</p>

The system operates on a multi-tiered architecture separating **High-Level Compute (Edge AI & Navigation)** from **Low-Level Actuation (Microcontroller & Power Electronics)**:

+-----------------------------------------------------------------------------------+
|                               HIGH-LEVEL COMPUTE                                  |
|                      [NVIDIA Jetson Orin Nano 8GB / Mini PC]                      |
|                                                                                   |
|  +-------------------------+  +--------------------------+  +------------------+  |
|  |   Perception & AI       |  |  ROS 2 Autonomous Nav    |  | Web & Telemetry  |  |
|  | - YOLOv8 (Obstacles)    |  | - Nav2 Stack / SLAM      |  | - FastAPI Server |  |
|  | - FaceNet / Dlib        |  | - Local/Global Costmaps  |  | - React Web App  |  |
|  | - Drowsiness / Seatbelt |  | - EKF State Estimation   |  | - WebSockets/mJPEG| |
|  +-------------------------+  +--------------------------+  +------------------+  |
+-----------------------------------------------------------------------------------+
│
Bidirectional Serial / UART Bridge
│
+-----------------------------------------------------------------------------------+
|                               LOW-LEVEL EMBEDDED                                  |
|                            [ESP32 Microcontroller]                                |
|                                                                                   |
|  +-----------------------+  +-------------------------+  +---------------------+  |
|  |  Safety Interlocks    |  | Ultrasonic Proximity    |  | IMU Feedback        |  |
|  | - Emergency E-Stop    |  | - 6x HC-SR04 Sensors    |  | - Closed-loop Yaw   |  |
|  +-----------------------+  +-------------------------+  +---------------------+  |
|                                         │                                         |
|                             PWM / Direction Control                               |
|                                         │                                         |
|                     2x BTS7960 Dual H-Bridge Motor Drivers                        |
|                                         │                                         |
|                    2x ZD101ZA1 24V 250W DC Motors (160 RPM)                       |
+-----------------------------------------------------------------------------------+
