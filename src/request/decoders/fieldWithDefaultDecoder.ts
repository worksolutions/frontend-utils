import Decoder from "jsonous";
import { isNil } from "ramda";
import { err, ok } from "resulty";
import { NullableType } from "../..";

export const fieldWithDefaultDecoder = <A>(key: string, decoder: Decoder<A>, defaultValue: NullableType<A> = null) =>
  new Decoder((value: Record<string, any>) => {
    if (isNil(value[key])) {
      return ok(defaultValue);
    }
    return decoder.decodeAny(value[key]).cata({
      Ok: (value) => ok<string, A>(value),
      Err: (error) => err<string, A>(error),
    });
  });
