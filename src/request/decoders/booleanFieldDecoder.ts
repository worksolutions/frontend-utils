import Decoder from "jsonous";
import { ok } from "resulty";

import { numberFieldDecoder } from "./numberFieldDecoder";

export const booleanFieldDecoder = (key: string) => {
  return new Decoder<boolean>((inputData) => {
    const value = numberFieldDecoder(key, { defaultValue: 0 }).decodeAny(inputData).getOrElseValue(null);
    return ok(!!value);
  });
};
