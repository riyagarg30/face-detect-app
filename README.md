# Face Detection App

A responsive web application built with **React**, **TypeScript**, and **Bootstrap** that captures webcam image feeds, performs face detection and recognition using **face-api.js**, and displays identified attributes (name, gender, age). Users can also upload images for detection.

## Features

*  Live webcam feed capture using `MediaDevices.getUserMedia()`
*  Facial recognition using `face-api.js` (based on TensorFlow\.js)
*  Face detection overlays with bounding boxes
*  Displays attributes: **Name**, **Gender**, **Age**
*  Upload image from device and perform detection
*  Detects **multiple faces** in an image

## Bonus Features

*  Image upload and face detection

## Tech Stack

* **Frontend Framework**: React
* **Language**: TypeScript
* **Face Recognition**: face-api.js (TensorFlow\.js-based)
* **Styling**: Custom CSS
* **Deployment**: \[ https://riyagarg30.github.io/face-detect-app/ ]

## 📦 Installation

```bash
git clone https://github.com/riyagarg30/face-detect-app.git
cd face-detect-app
npm install
npm start
```

## 🌐 Live Demo

\[ https://riyagarg30.github.io/face-detect-app/ ]

## 🧪 Architecture Overview

* `App.tsx`: Entry point rendering the main component
* `WebcamFaceCapture.tsx`: Captures webcam feed and processes images
* `faceApiService.ts`: Loads face-api.js models and performs detection

## 🧠 Model

* Uses **pre-trained models** (`tiny_face_detector`, `age_gender`, `face_landmark_68`, `face_recognition`) from face-api.js
* Models loaded asynchronously and cached in memory

