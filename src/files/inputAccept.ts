import { memoizeWith } from "../memoizeWith";

export enum AcceptTypes {
  IMAGE = "image/*",
  GLB = "model/gltf-binary",
  ALL = "*",
}

export const makeInputAccept = memoizeWith(
  (accepts) => accepts.join(""),
  (accepts: AcceptTypes[]) => accepts.join(","),
);
