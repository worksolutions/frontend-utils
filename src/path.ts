import { path as ramdaPath } from "ramda";

import { isString } from "./is";

export function splitByPoint(path: string) {
  return path.split(".");
}

export function path(fullPath: string | string[], obj: any): any {
  if (isString(fullPath)) return ramdaPath(splitByPoint(fullPath), obj);
  return ramdaPath(fullPath, obj);
}
