import { NullableType } from "..";

export function parseJsonSelf<T>(param: string, callbackError: (error: Error) => void): NullableType<T> {
  try {
    return JSON.parse(param) as T;
  } catch (error) {
    callbackError(error);
    return null;
  }
}
