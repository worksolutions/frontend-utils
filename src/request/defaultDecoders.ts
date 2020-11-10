import Decoder, { field, succeed, string, maybe } from "jsonous";
import { ok, err } from "resulty";
import { isNil } from "ramda";
import moment, { Moment } from "moment";
import { isNothing } from "maybeasy";

import { DateMode } from "../date";
import { isString } from "../is";

export const identityValueDecoder = new Decoder(ok);

export const valueDecoder = <T>(inputValue: T) =>
  new Decoder<T>(function (value) {
    return value === inputValue ? ok<string, T>(value) : err(`Пришло: "${value}"; Ожидалось "${inputValue}"`);
  });

export const withDefaultValueDecoder = <A, D>(decoder: Decoder<A>, defaultValue: D) =>
  new Decoder((value: Record<string, any>) => {
    return decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, A | D>(value),
      Err: () => ok<string, D>(defaultValue),
    });
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

export function codeTitleFieldDecoder(code: string | Decoder<string | null>, title: string | Decoder<string | null>) {
  return succeed({})
    .assign("code", isString(code) ? fieldWithDefaultDecoder(code, string, "") : code)
    .assign("title", isString(title) ? fieldWithDefaultDecoder(title, string, "") : title);
}

export function momentFieldDecoder(key: string, mode = DateMode.DATE, defaultValue?: Moment) {
  return maybe(field(key, string)).map((maybeValue) => {
    defaultValue = defaultValue || moment.invalid();
    if (isNothing(maybeValue)) return defaultValue;
    const value = maybeValue.getOrElseValue(null!);
    return !value.length ? defaultValue : moment(value, mode);
  });
}
