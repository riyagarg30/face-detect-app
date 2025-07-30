// src/services/faceDatabase.ts
import * as faceapi from "face-api.js";

interface FaceProfile {
  name: string;
  gender: string;
  age: string;
  descriptor: Float32Array;
}

const faceDB: FaceProfile[] = [];

export const addFaceToDB = (profile: Omit<FaceProfile, "descriptor"> & { descriptor: Float32Array }) => {
  faceDB.push(profile);
};

export const findBestMatch = (descriptor: Float32Array): FaceProfile | null => {
  if (faceDB.length === 0) return null;

  const faceMatcher = new faceapi.FaceMatcher(
    faceDB.map(p => new faceapi.LabeledFaceDescriptors(p.name, [p.descriptor]))
  );

  const bestMatch = faceMatcher.findBestMatch(descriptor);
  const label = bestMatch.label;

  return label === "unknown" ? null : faceDB.find(p => p.name === label) || null;
};
