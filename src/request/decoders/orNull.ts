import Decoder from "jsonous";
import {ok} from "resulty";
import {NullableType} from "../..";

export function orNull<T>(decoder: Decoder<T>, defaultValue: NullableType<T> = null) {
  return new Decoder<T | null>((value) => {
    return decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, T>(value),
      Err: () => ok<string, T | null>(defaultValue),
    });
  });
}
