// src/components/WebcamFaceCapture.tsx
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { loadModels, detectFaces } from "../services/faceApiService";
import { addFaceToDB, findBestMatch } from "../services/faceDatabase";

const WebcamFaceCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lastInputRef = useRef<HTMLVideoElement | HTMLImageElement | null>(null);

  const [isCaptured, setIsCaptured] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [faceImageData, setFaceImageData] = useState<string | null>(null);
  const [newFaceDescriptor, setNewFaceDescriptor] =
    useState<Float32Array | null>(null);
  const [newFaceDetails, setNewFaceDetails] = useState({
    name: "",
    gender: "",
    age: "",
  });

  useEffect(() => {
    const load = async () => {
      await loadModels();
      console.log("✅ Models loaded");
    };
    load();
  }, []);

  const processCanvas = async (input: HTMLVideoElement | HTMLImageElement) => {
    lastInputRef.current = input;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Set canvas size based on input type
    if (input instanceof HTMLVideoElement) {
      canvas.width = input.videoWidth;
      canvas.height = input.videoHeight;
    } else {
      canvas.width = input.width;
      canvas.height = input.height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(input, 0, 0, canvas.width, canvas.height);

    const results = await detectFaces(canvas);

    results.sort((a, b) => a.detection.box.x - b.detection.box.x);

    // console.log("results", results)

    for (const result of results) {
      const { x, y, width, height } = result.detection.box;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      const match = findBestMatch(result.descriptor);
      if (match) {
        ctx.fillStyle = "red";
        ctx.font = "15px Arial";
        ctx.fillText(match.name, x, y - 10);
        ctx.fillText(match.gender, x, y);
        ctx.fillText(match.age, x, y + 10);
      } else {
        // const name = prompt("New face detected! Enter name:");
        // const gender = prompt("Enter gender:");
        // const age = prompt("Enter age:");
        // if (name && gender && age) {
        //   addFaceToDB({ name, gender, age, descriptor: result.descriptor });
        //   ctx.fillStyle = "blue";
        //   ctx.fillText(name, x, y - 10);
        //   ctx.fillText(gender, x, y);
        //   ctx.fillText(age, x, y + 10);
        // }
        // const faceCanvas = document.createElement("canvas");
        // faceCanvas.width = width;
        // faceCanvas.height = height;
        // const faceCtx = faceCanvas.getContext("2d");
        // if (faceCtx) {
        //   faceCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        //   const faceDataUrl = faceCanvas.toDataURL("image/jpeg");

        //   setFaceImageData(faceDataUrl);
        //   setNewFaceDescriptor(result.descriptor);
        //   setShowModal(true); // Show modal
        // }
        if (width > 0 && height > 0 && canvas.width > 0 && canvas.height > 0) {
          const faceCanvas = document.createElement("canvas");
          faceCanvas.width = width;
          faceCanvas.height = height;

          const faceCtx = faceCanvas.getContext("2d");
          if (faceCtx) {
            faceCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
            const faceDataUrl = faceCanvas.toDataURL("image/jpeg");

            setFaceImageData(faceDataUrl);
            setNewFaceDescriptor(result.descriptor);
            setShowModal(true); // Show modal
            return; // Stop processing other faces until modal is handled
          }
        }
      }
    }

    setIsCaptured(true);
  };

  const capture = () => {
    const video = webcamRef.current?.video;
    if (video) processCanvas(video);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 500 / img.height;
        canvas.height = 500;
        canvas.width = img.width * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedDataUrl = canvas.toDataURL("image/jpeg"); // or "image/png"
        setUploadedImage(resizedDataUrl);
        setIsCaptured(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const takeAnother = () => {
    setIsCaptured(false);
    setUploadedImage(null);
  };

  return (
    <div>
      {!isCaptured && !uploadedImage && (
        <Webcam
          // className="webcam-container"
          ref={webcamRef}
          // width={640}
          height={500}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
          }}
        />
      )}

      {/* Render uploaded image offscreen to process it */}
      {uploadedImage && (
        <img
          ref={imageRef}
          src={uploadedImage}
          alt="Uploaded"
          style={{ display: "none", width: 640, height: 480 }}
          onLoad={() => imageRef.current && processCanvas(imageRef.current)}
        />
      )}

      <canvas
        ref={canvasRef}
        style={{ display: isCaptured ? "block" : "none", height: 500 }}
      />
      <br />
      {!isCaptured && (
        <>
          <button onClick={capture}>📸 Capture & Detect Faces</button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </>
      )}
      {isCaptured && <button onClick={takeAnother}>🔁 Take Another</button>}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Face Detected</h3>
            {faceImageData && <img src={faceImageData} alt="Face Preview" />}
            <input
              type="text"
              placeholder="Name"
              value={newFaceDetails.name}
              onChange={(e) =>
                setNewFaceDetails({ ...newFaceDetails, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Gender"
              value={newFaceDetails.gender}
              onChange={(e) =>
                setNewFaceDetails({ ...newFaceDetails, gender: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Age"
              value={newFaceDetails.age}
              onChange={(e) =>
                setNewFaceDetails({ ...newFaceDetails, age: e.target.value })
              }
            />
            <div>
              <button
                onClick={() => {
                  if (
                    newFaceDescriptor &&
                    newFaceDetails.name &&
                    newFaceDetails.gender &&
                    newFaceDetails.age
                  ) {
                    addFaceToDB({
                      name: newFaceDetails.name,
                      gender: newFaceDetails.gender,
                      age: newFaceDetails.age,
                      descriptor: newFaceDescriptor,
                    });
                    setShowModal(false);
                    setFaceImageData(null);
                    setNewFaceDescriptor(null);
                    setNewFaceDetails({ name: "", gender: "", age: "" });
                    if (lastInputRef.current) {
                      processCanvas(lastInputRef.current);
                    }
                  }
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFaceImageData(null);
                  setNewFaceDescriptor(null);
                  setNewFaceDetails({ name: "", gender: "", age: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamFaceCapture;
