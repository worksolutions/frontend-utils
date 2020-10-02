import Decoder, { field } from "jsonous";
import { ok } from "resulty";
import { isNil } from "ramda";

import { identityValueDecoder } from "./identityValueDecoder";
import { NullableType } from "../../types/DecoderType";

export enum NumberFieldNumChecker {
  EMPTY_STRING,
  NULL,
  NULL_AND_EMPTY_STRING,
}

const numberFieldNumCheckers = {
  [NumberFieldNumChecker.EMPTY_STRING]: (value: any, defaultValue: number) => (value === "" ? defaultValue : value),
  [NumberFieldNumChecker.NULL]: (value: any, defaultValue: number) => (isNil(value) ? defaultValue : value),
  [NumberFieldNumChecker.NULL_AND_EMPTY_STRING]: (value: any, defaultValue: number) =>
    isNil(value) || value === "" ? defaultValue : value,
};

export const numberFieldDecoder = (
  key: string,
  data: {
    nullEmptyChecker?: NumberFieldNumChecker;
    defaultValue?: number;
  } = {},
) => {
  return new Decoder<NullableType<number>>((inputData) => {
    const value = field(key, identityValueDecoder).decodeAny(inputData).getOrElseValue(null);
    const newValue = numberFieldNumCheckers[data.nullEmptyChecker || NumberFieldNumChecker.NULL_AND_EMPTY_STRING](
      value,
      data["defaultValue"] ? data.defaultValue : 0,
    );

    return ok(isNil(newValue) ? null : parseFloat(newValue.toString().replace(",", ".")));
  });
};
