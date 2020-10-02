import Decoder from "jsonous";
import { ok, err } from "resulty";

export const falseValueDecoder = new Decoder<false>(function (value) {
  return value === false ? ok<string, false>(false) : err('Ожидалось "false"');
});
