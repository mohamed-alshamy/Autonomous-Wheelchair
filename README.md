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

---

## 🛠 Hardware Specifications

| Component Category | Hardware Model / Details | Functional Role |
| :--- | :--- | :--- |
| **Compute Engine** | NVIDIA Jetson Orin Nano (8GB) | High-level perception, deep learning inference, ROS 2 Nav2, local server |
| **Primary Storage** | NVMe M.2 SSD | High-speed OS host, deep learning models, logging database |
| **User Display** | 7-inch Capacitive Touchscreen | Local human-machine interface (HMI) for navigation & status |
| **Low-Level MCU** | ESP32-WROOM (38-Pin) | Real-time motor PWM control, sensor reading, hard safety stops |
| **Motor Drivers** | 2x BTS7960 High-Power H-Bridges | Differential motor speed & directional drive execution |
| **Drive Actuators** | 2x ZD101ZA1 Brushed DC Motors | 24V DC, 250W per motor, 160 RPM high-torque output |
| **Primary Battery** | 24V / 12Ah Lithium-Ion Battery Pack | Dedicated power delivery for motors & drive electronics |
| **Compute Battery** | 19.5V Auxiliary Power Pack | Isolated clean power supply for Jetson Orin Nano / Mini PC |
| **Front Vision** | RGB Navigation Camera | High-framerate forward object detection, sign detection, lane awareness |
| **Rear Vision** | RGB Rear Safety Camera | Blind-spot spatial monitoring during reverse/maneuvers |
| **User Vision** | RGB Driver-Facing Camera | Face verification, eye-aspect ratio (EAR) drowsiness monitoring |
| **Proximity Sensing**| 6x HC-SR04 Ultrasonic Sensors | 360-degree close-range collision boundary detection |
| **Spatial Motion** | 6-DOF IMU (Inertial Measurement Unit) | Real-time orientation tracking, tilt sensing, and dead reckoning |

---

## 💻 Software & Technology Stack
