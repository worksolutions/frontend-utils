import Decoder, { field, maybe, string, succeed } from "jsonous";
import { err, ok } from "resulty";
import { isNil } from "ramda";
import moment, { Moment } from "moment";
import { isNothing } from "maybeasy";

import { DateMode } from "./intl";

export const identityValueDecoder = new Decoder(ok);

export const valueDecoder = <T>(inputValue: T) =>
  new Decoder<T>((value) =>
    value === inputValue ? ok<string, T>(value) : err(`Income: "${value}"; Expect: "${inputValue}"`),
  );

export const orDefaultDecoder = <DECODER_VALUE, DEFAULT_VALUE>(
  decoder: Decoder<DECODER_VALUE>,
  defaultValue: DEFAULT_VALUE,
) =>
  new Decoder((value: Record<string, any>) =>
    decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, DECODER_VALUE | DEFAULT_VALUE>(value),
      Err: () => ok<string, DEFAULT_VALUE>(defaultValue),
    }),
  );

export const fieldOrDefaultDecoder = <A>(key: string, decoder: Decoder<A>, defaultValue: A | null = null) =>
  new Decoder((value: Record<string, any>) => {
    if (isNil(value[key])) return ok(defaultValue);

    return orDefaultDecoder(value[key], defaultValue).decodeAny(value);
  });

export const momentFieldDecoder = (key: string, mode: DateMode, defaultValue?: Moment) =>
  maybe(field(key, string)).map((maybeValue) => {
    defaultValue = defaultValue || moment.invalid();
    if (isNothing(maybeValue)) return defaultValue;
    const value = maybeValue.getOrElseValue(null!);
    return !value.length ? defaultValue : moment(value, mode);
  });

export function toInstanceDecoder<T>(Class: { new (): T }): (obj: Partial<T>) => Decoder<T> {
  return (obj) => succeed(Object.assign(new Class(), obj));
}

export const mergeRightDecoders = <FIRST, SECOND>(firstDecoder: Decoder<FIRST>, secondDecoder: Decoder<SECOND>) =>
  new Decoder<FIRST & SECOND>((input) => {
    const first = firstDecoder.decodeAny(input);
    return first.andThen((firstValue) =>
      secondDecoder.map((secondValue) => ({ ...firstValue, ...secondValue })).decodeAny(input),
    );
  });
