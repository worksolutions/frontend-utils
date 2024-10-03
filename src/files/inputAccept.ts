import { memoizeWith } from "../memoizeWith";

export enum AcceptTypes {
  IMAGE = "image/*",
  GLB = ".glb",
  GLTF = ".gltf",
  JSON = ".json",
  ALL = "*",
}

export const makeInputAccept = memoizeWith(
  (accepts) => accepts.join(""),
  (accepts: AcceptTypes[]) => accepts.join(","),
);
