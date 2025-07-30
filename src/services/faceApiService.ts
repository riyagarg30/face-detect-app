// src/services/faceApiService.ts
import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const MODEL_URL = "/face-detect-app/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
};

export const detectFaces = async (input: HTMLCanvasElement | HTMLVideoElement) => {
  return await faceapi.detectAllFaces(
    input,
    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();;
};

export const detectFacesFromCanvas = async (
  input: HTMLCanvasElement | HTMLVideoElement
) => {
  return await faceapi.detectAllFaces(
    input,
    new faceapi.TinyFaceDetectorOptions()
  );
};

// src/services/faceApiService.ts
// import * as faceapi from "face-api.js";

// export const loadModels = async () => {
//   const MODEL_URL = "/models";
//   await Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//     faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//     faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//   ]);
// };

// export const detectFaces = async (input: HTMLCanvasElement | HTMLVideoElement) => {
//   return await faceapi
//     .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
//     .withFaceLandmarks()
//     .withFaceDescriptors();
// };
