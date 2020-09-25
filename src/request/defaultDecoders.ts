import Decoder, { field, maybe, string } from "jsonous";
import { err, ok } from "resulty";
import { isNil } from "ramda";
import moment, { Moment } from "moment";
import { isNothing } from "maybeasy";

import { DateMode } from "../date";

export const identityValueDecoder = new Decoder(ok);

export const valueDecoder = <T>(inputValue: T) =>
  new Decoder<T>(function (value) {
    return value === inputValue ? ok<string, T>(value) : err(`Пришло: "${value}"; Ожидалось "${inputValue}"`);
  });

export const fieldWithDefaultDecoder = <A>(key: string, decoder: Decoder<A>, defaultValue: A | null = null) =>
  new Decoder((value: Record<string, any>) => {
    if (isNil(value[key])) {
      return ok(defaultValue);
    }
    return decoder.decodeAny(value[key]).cata({
      Ok: (value) => ok<string, A>(value),
      Err: (error) => err<string, A>(error),
    });
  });

export function momentFieldDecoder(key: string, mode = DateMode.DATE, defaultValue?: Moment) {
  return maybe(field(key, string)).map((maybeValue) => {
    defaultValue = defaultValue || moment.invalid();
    if (isNothing(maybeValue)) return defaultValue;
    const value = maybeValue.getOrElseValue(null!);
    return !value.length ? defaultValue : moment(value, mode);
  });
}
