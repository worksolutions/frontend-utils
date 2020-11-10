import Decoder, { field, keyValuePairs, string, succeed } from "jsonous";
import { fromPairs } from "ramda";
import { ok } from "resulty";

import { withDefaultValueDecoder } from "./request/defaultDecoders";

interface ErrorInterface {
  message: string;
  errors: Record<string, string>;
}

const errorDecoder = succeed({})
  .assign("message", withDefaultValueDecoder(field("message", string), ""))
  .assign(
    "errors",
    withDefaultValueDecoder(
      field(
        "errors",
        keyValuePairs(
          new Decoder((errorData) => {
            const stringError = string.decodeAny(errorData);
            return stringError.cata({
              Ok: (value) => ok(value),
              Err: () => ok(JSON.stringify(errorData)),
            });
          }),
        ).map((pairs) => fromPairs(pairs)),
      ),
      {},
    ),
  );

export class BaseError {
  static isBaseError(value: any): value is BaseError {
    return value instanceof BaseError;
  }

  static make(message: string, errors: Record<string, string> = {}) {
    return new BaseError({
      message,
      errors,
    });
  }

  error: ErrorInterface;

  constructor(error: any) {
    this.error = errorDecoder
      .decodeAny(error)
      .getOrElseValue({ message: "Не удалось определить формат ошибки", errors: {} });
  }

  hasErrors() {
    return Object.keys(this.error.errors).length !== 0;
  }

  getErrors() {
    return this.error.errors;
  }

  getMessage() {
    return this.error.message;
  }

  getErrorOrMessage() {
    const errors = this.getErrors();
    const keys = Object.keys(errors);
    if (keys.length === 0) return this.getMessage();
    return errors[keys[0]];
  }
}
