export interface FaceProfile {
  name: string;
  gender: string;
  age: number;
  descriptor: Float32Array; // 128-dimensional
}
