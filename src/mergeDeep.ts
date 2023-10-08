import { isPureObject } from "./is";

function _has(prop: string, obj: Record<string, any>) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function mergeWithKey(fn: (str: string, x: any, z: any) => any, l: any, r: any) {
  const result: Record<string, any> = {};
  let k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
}

function mergeDeepWithKey(fn: (k: string, x: any, z: any) => any, lObj: any, rObj: any): Record<string, any> {
  return mergeWithKey(
    function (k, lVal, rVal) {
      if (isPureObject(lVal) && isPureObject(rVal)) {
        return mergeDeepWithKey(fn, lVal, rVal);
      } else {
        return fn(k, lVal, rVal);
      }
    },
    lObj,
    rObj,
  );
}

export function mergeDeepRight(lObj: Record<string, any>, rObj: Record<string, any>) {
  return mergeDeepWithKey(
    function (k, lVal, rVal) {
      return rVal;
    },
    lObj,
    rObj,
  );
}
