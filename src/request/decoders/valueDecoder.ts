import Decoder from "jsonous";
import { err, ok } from "resulty";

export const valueDecoder = <T>(inputValue: T) =>
  new Decoder<T>(function (value) {
    return value === inputValue ? ok<string, T>(value) : err(`Пришло: "${value}"; Ожидалось "${inputValue}"`);
  });
