import Decoder, { field, succeed } from "jsonous";
import { err, ok } from "resulty";
import { isNil } from "ramda";

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

export function fieldOrDefaultDecoder<A>(key: string, decoder: Decoder<A>, defaultValue: A | undefined = undefined) {
  return new Decoder((value: Record<string, any>) => {
    if (isNil(value[key])) return ok(defaultValue);

    return orDefaultDecoder(field(key, decoder), defaultValue).decodeAny(value);
  });
}

export function toInstanceDecoder<T>(Class: { new (): T }): (obj: Partial<T>) => Decoder<T> {
  return (obj) => succeed(Object.assign(new Class(), obj));
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
