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
    <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/NEURONIX%20Intelligence%20Logo.png" width="350" alt="MAVERICK Demo">
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

| Directory / File | Description |
| :--- | :--- |
| 📁 **`docs/`** | Architecture diagrams, mechanical CAD & specifications |
| 📁 **`firmware_esp32/src/`** | Low-level C++ embedded firmware (FreeRTOS / Arduino) |
| 📄 `├── main.cpp` | Serial parser, PWM generation & safety state machines |
| 📄 `├── motors.cpp` | BTS7960 dual H-bridge driver control logic |
| 📄 `└── sensors.cpp` | HC-SR04 ultrasonic array & IMU filtering |
| 📁 **`maverick_ros2/`** | ROS 2 Humble workspace & main packages |
| 📁 `├── maverick_bringup` | Master system launch files & hardware integration |
| 📁 `├── maverick_navigation` | Nav2 costmaps, path planners & SLAM configs |
| 📁 `├── maverick_perception` | CUDA/TensorRT YOLOv8 & OpenCV perception nodes |
| 📁 `└── maverick_teleop` | Velocity command translators (`/cmd_vel`) |
| 📁 **`server_backend/app/`** | FastAPI control server, WebSockets & vision engine |
| 📁 **`ui_dashboard/src/`** | React 18 / TypeScript Dark Robotics UI (7-inch HMI) |

### Stack Breakdown

* **Operating System:** Ubuntu 22.04 LTS (Linux) / JetPack 5.x / 6.x
* **Middleware & Robotics:** ROS 2 (Humble Hawksbill), Nav2 Stack, SLAM Toolbox
* **Languages:** C++17 (Low-Level & High-Performance Nodes), Python 3.10+, TypeScript
* **Computer Vision & AI:** OpenCV, CUDA, TensorRT, YOLOv8 (Ultralytics), DeepFace, FaceNet, Dlib
* **Backend Engine:** FastAPI, Uvicorn, WebSockets, Python-Serial, Supabase
* **Frontend UI Engine:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion

---

## 🧠 AI Models & Computer Vision Pipelines

MAVERICK executes multiple AI-powered vision pipelines optimized for real-time edge inference.

### 🤖 Deployed AI Models

The core computer vision models are containerized using **Docker** and publicly available through **Docker Hub**. Each model can be pulled independently and integrated into the MAVERICK perception pipeline.

| Model                  | Function                                           | Docker Image                                                                          |
| :--------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **YOLOv8 Detection**   | Real-time object and obstacle detection            | [`shamy028/yolov8_detection`](https://hub.docker.com/r/shamy028/yolov8_detection)     |
| **Face Verification**  | User identity verification and authentication      | [`shamy028/face_verification`](https://hub.docker.com/r/shamy028/face_verification)   |
| **Eye Detection**      | Eye-state analysis for drowsiness monitoring       | [`shamy028/eye_detection`](https://hub.docker.com/r/shamy028/eye_detection)           |
| **Seatbelt Detection** | Seatbelt engagement detection and safety interlock | [`shamy028/seatbelt_detection`](https://hub.docker.com/r/shamy028/seatbelt_detection) |

### 🐳 Docker Model Deployment

Pull the required AI services directly from Docker Hub:

```bash
docker pull shamy028/yolov8_detection:latest
docker pull shamy028/face_verification:latest
docker pull shamy028/eye_detection:latest
docker pull shamy028/seatbelt_detection:latest
```

These containerized models provide a reproducible deployment path for the MAVERICK AI inference stack across supported development and edge-computing environments.

### 1. Spatial Perception (Front & Rear Cameras)

* **Object Detection:** **YOLOv8** optimized via **NVIDIA TensorRT** for real-time detection of dynamic obstacles (pedestrians, vehicles, indoor barriers, furniture, stairs).
* **Floor & Sign Recognition:** Custom CV pipelines for surface integrity assessment and indoor navigation sign identification.

### 2. Driver Monitoring System (DMS - User-Facing Camera)

* **Face Verification & Identity:** **FaceNet / DeepFace** embeddings matched against local profiles stored in Supabase/Local DB for personalized access.
* **Drowsiness & Fatigue Detection:** Facial landmark extraction via **Dlib** to compute the **Eye Aspect Ratio (EAR)** and **Mouth Aspect Ratio (MAR)** in real time. Triggers warnings when micro-sleep is detected.
* **Head Pose Estimation:** 3D projection analysis tracking user attention and orientation.
* **Seatbelt Safety Interlock:** Neural network check ensuring seatbelt engagement prior to motor actuation release.

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/AI%20Models.jpeg" width="650" alt="MAVERICK AI Models">
</p>


---

## 🔌 Embedded Systems & Low-Level Control

The **ESP32** handles low-latency tasks required for physical execution and safety:

* **Differential Drive Control:** Generates dual high-frequency PWM channels for two **BTS7960** drivers, translating speed ($v$) and angular velocity ($\omega$) from ROS 2 `/cmd_vel` topics into exact voltage outputs.
* **Hard Emergency Brake (Ultrasonic Array):** Independent hardware interrupt loop evaluating data from 6x **HC-SR04** sensors. Overrides incoming movement commands if an obstacle breaches the critical safety zone ($<30\text{ cm}$).
* **IMU Fusion:** Continuously samples angular velocity and linear acceleration, publishing telemetry back to the Jetson Orin Nano over high-baud UART for EKF-based state estimation.

---

## 🖥️ User Dashboard & Web Interface

Designed using **NEURONIX Dark-Robotics UI Standards** (Glassmorphism, high contrast, smooth telemetry visualization):

* **Real-time Video Feeds:** Low-latency mJPEG/WebSocket camera streams with AI bounding-box overlays.
* **Control Center:** Instant switching between **Manual Driving Mode** (onscreen joystick/keyboard teleop) and **Autonomous Navigation Mode**.
* **Mapping & Goals:** Interactive navigation map allowing points of interest (POIs) and destination selections.
* **System Telemetry:** Live visualization of speed, IMU pitch/roll/yaw, battery state-of-charge, active warnings, and AI safety interlocks.

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/Dashboard" width="650" alt="MAVERICK Banner">
</p>

---

## 🔄 System Integration & Workflow

<p align="center">
  <img src="https://github.com/mohamed-alshamy/Autonomous-Wheelchair/blob/main/System%20Workflow.jpeg" width="650" alt="MAVERICK Banner">
</p>

1. **Authentication:** The system verifies the user via the front-facing camera using FaceNet.
2. **Safety Check:** System confirms seatbelt fastening and ensures driver alert status (EAR thresholds).
3. **Target Selection:** User selects an autonomous target destination via the 7-inch HMI Touchscreen.
4. **Path Planning:** ROS 2 Nav2 computes the optimal path while avoiding local static/dynamic obstacles via YOLOv8 and costmap feedback.
5. **Execution & Interlocks:** Drive commands translate to motor movements. If an unforeseen obstacle appears within close range, the ESP32 Ultrasonic array triggers an emergency override, coming to a soft-stop independently of high-level software loops.

---

## ⚙️ Installation & Setup

### Prerequisites

Ensure your host environment runs **Ubuntu 22.04 LTS** with **ROS 2 Humble** installed.

```bash
# Clone the repository with all submodules
git clone [https://github.com/mohamed-alshamy/Autonomous-Wheelchair.git](https://github.com/mohamed-alshamy/Autonomous-Wheelchair.git)
cd Autonomous-Wheelchair

# 1. ROS 2 Workspace Build
cd maverick_ros2
colcon build --symlink-install
source install/setup.bash

# 2. Backend Server Setup
cd ../server_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 3. Frontend Dashboard Launch
cd ../ui_dashboard
npm install
npm run dev
```

---

## 🏛️ Institutional Collaboration & Key Recognition

Project **MAVERICK** is developed under the auspices and partnership of key national technology and inclusion initiatives:

* **Ministry of Communications and Information Technology (MCIT)** — Supporting innovation in assistive technologies and accessible digital solutions.
* **National Academy of Information Technology for Persons with Disabilities (NAID)** — Strategic collaboration and technical framework alignment for empowering persons with disabilities through advanced AI & Robotics.

### 🎖️ National Distinction & Honors
Project **MAVERICK** was selected among the **Top 10 Flagship Engineering Projects** nationwide to be presented before high-level government leadership, including:
* The **Minister of Defense**
* The **Minister of Industry**
* The **Minister of Higher Education and Scientific Research**
* The **Minister of Health and Population**

---

## 👥 Engineering & Credits
Project MAVERICK is designed, architected, and maintained by:

Mohamed Elsayed Alshamy — Lead System Architect, AI & Robotics Engineer

Developed as a flagship intelligent mobility platform under NEURONIX Intelligence.

## 📄 License
This repository is distributed under the MIT License. See the LICENSE file for details.
