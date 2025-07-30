// src/App.tsx
import React from "react";
import WebcamFaceCapture from "./components/WebcamFaceCapture";
import "./FaceApp.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="app-title">Face Detection Application</div>
      <WebcamFaceCapture />
    </div>
  );
};

export default App;
