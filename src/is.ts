import { is } from "ramda";

export function isString(arg: any): arg is string {
  return is(String, arg);
}

export function isNumber(arg: any): arg is number {
  return is(Number, arg);
}

export function isFunction(arg: any): arg is Function {
  return is(Function, arg);
}

export function isArray(arg: any): arg is Array<any> {
  return is(Array, arg);
}

export function isPureObject(arg: any): arg is Record<string, any> {
  return is(Object, arg) && !Array.isArray(arg);
}
