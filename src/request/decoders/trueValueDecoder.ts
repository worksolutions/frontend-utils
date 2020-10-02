import Decoder from "jsonous";
import { ok, err } from "resulty";

export const trueValueDecoder = new Decoder<true>(function (value) {
  return value === true ? ok<string, true>(true) : err('Ожидалось "true"');
});
