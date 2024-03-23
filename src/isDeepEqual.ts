import { omit } from "./omit";

// eslint-disable-next-line complexity
export function isDeepEqual(objA: any, objB: any) {
  if (Object.is(objA, objB)) return true;

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;

  if (objA.prototype !== objB.prototype) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  // @ts-ignore
  const bHasOwnProperty = hasOwnProperty.bind(objB);
  while (keysA.length > 0) {
    const key: any = keysA.pop();

    if (!bHasOwnProperty(key)) return false;

    const a = objA[key];
    const b = objB[key];
    if (!Object.is(a, b)) {
      if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

      if (!isDeepEqual(a, b)) return false;
    }
  }

  return true;
}

export function makeExcludingDeepEqual(excludeObjectKeys: string[]) {
  return function (obj1: Record<string, any>, obj2: Record<string, any>) {
    const resultObjA = omit(excludeObjectKeys, obj1);
    const resultObjB = omit(excludeObjectKeys, obj2);
    return isDeepEqual(resultObjA, resultObjB);
  };
}
