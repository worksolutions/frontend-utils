import { isNumber, isString } from "./is";

export function splitByPoint(path: string) {
  return path.split(".");
}

function nth(offset: number, list: string | any[]) {
  const idx = offset < 0 ? list.length + offset : offset;
  return isString(list) ? list.charAt(idx) : list[idx];
}

type Path = (string | number)[];

function paths(pathsArray: Path[], obj: any) {
  return pathsArray.map(function (paths) {
    let val = obj;
    let idx = 0;
    let p;

    while (idx < paths.length) {
      if (val == null) return undefined;

      p = paths[idx];
      val = isNumber(p) ? nth(p, val) : val[p];
      idx += 1;
    }

    return val;
  });
}

function pathArray(path: Path, obj: any) {
  return paths([path], obj)[0];
}

export function path<T>(fullPath: string | Path, obj: any): T {
  if (isString(fullPath)) return pathArray(splitByPoint(fullPath), obj) as T;
  return pathArray(fullPath, obj) as T;
}
