import Decoder, { field, string, succeed } from "jsonous";
import { err, ok } from "resulty";
import { isNil } from "ramda";
import { OptionalKeys, RequiredKeys } from "utility-types";

export const identityValueDecoder = new Decoder(ok);

export function valueDecoder<T>(inputValue: T) {
  return new Decoder<T>(
    (value) => (value === inputValue ? ok<string, T>(value) : err(`Income: "${value}"; Expect: "${inputValue}"`)), //TODO: вынести в INTL
  );
}

export function orDefaultDecoder<DECODER_VALUE, DEFAULT_VALUE>(
  decoder: Decoder<DECODER_VALUE>,
  defaultValue: DEFAULT_VALUE,
) {
  return new Decoder((value: Record<string, any>) =>
    decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, DECODER_VALUE | DEFAULT_VALUE>(value),
      Err: () => ok<string, DEFAULT_VALUE>(defaultValue),
    }),
  );
}

export function fieldOrDefaultDecoder<A, D extends A | undefined>(
  key: string,
  decoder: Decoder<A>,
  defaultValue: D = undefined as D,
) {
  return new Decoder<D extends undefined ? undefined : A>((value: Record<string, any>) => {
    if (isNil(value[key])) return ok(defaultValue) as any;
    return orDefaultDecoder(field(key, decoder), defaultValue).decodeAny(value);
  });
}

export function toInstance<T, REQUIRED_KEYS extends RequiredKeys<T>, OPTIONAL_KEYS extends OptionalKeys<T>>(Class: {
  new (): T;
}): (obj: Record<REQUIRED_KEYS, T[REQUIRED_KEYS]> & Partial<Record<OPTIONAL_KEYS, T[OPTIONAL_KEYS]>>) => T {
  return (obj) => Object.assign(new Class(), obj);
}

export function toInstanceDecoder<
  T,
  REQUIRED_KEYS extends RequiredKeys<T>,
  OPTIONAL_KEYS extends OptionalKeys<T>
>(Class: {
  new (): T;
}): (obj: Record<REQUIRED_KEYS, T[REQUIRED_KEYS]> & Partial<Record<OPTIONAL_KEYS, T[OPTIONAL_KEYS]>>) => Decoder<T> {
  return (obj) => succeed(toInstance(Class)(obj as any));
}

export function mergeRightDecoders<FIRST, SECOND>(firstDecoder: Decoder<FIRST>, secondDecoder: Decoder<SECOND>) {
  return new Decoder<FIRST & SECOND>((input) => {
    const first = firstDecoder.decodeAny(input);
    return first.andThen((firstValue) =>
      secondDecoder.map((secondValue) => ({ ...firstValue, ...secondValue })).decodeAny(input),
    );
  });
}

export function enumDecoder<VALUES>(matches: Record<string | number, VALUES>) {
  return new Decoder<VALUES>((input) => {
    if (matches[input]) return ok(matches[input]);
    return err(`enum decoder error.\nIncome ${JSON.stringify(input)};\nExpected: ${JSON.stringify(matches)}`);
  });
}
