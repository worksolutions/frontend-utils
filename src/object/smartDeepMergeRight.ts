import { mergeWithKey } from "ramda";

function isObject(x: any) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

export const smartDeepMergeRight = (deepLevelThreshold: number) => {
  return function mergeDeepWithKey(lObj: any, rObj: any, _level = 1): any {
    return mergeWithKey(
      (_, lVal, rVal) => {
        if (isObject(lVal) && isObject(rVal) && _level < deepLevelThreshold) {
          return mergeDeepWithKey(lVal, rVal, _level + 1);
        }
        return rVal;
      },
      lObj,
      rObj,
    );
  };
};
