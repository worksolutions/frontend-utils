import Decoder from "jsonous";
import { isNil } from "ramda";
import { err, ok } from "resulty";

export const toStringDecoder = new Decoder<string>((value) => {
  let result = null;
  try {
    result = value.toString();
  } catch (e) {}
  return isNil(result) ? err(`Не удалось привести "${value}" к строковому типу.`) : ok(result);
});
