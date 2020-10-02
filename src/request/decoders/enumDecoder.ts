import Decoder from "jsonous";
import {err, ok} from "resulty";

export function enumDecoder<T>(key: string, map: { [key: string]: T }, defaultValue?: T, handler?: (value: any) => T) {
  return new Decoder((value) => {
    const fieldValue = value[key];
    const valueInMap = map[fieldValue];

    if (valueInMap === undefined) {
      const availableTypesString = JSON.stringify(Object.keys(map));

      return handler !== undefined
        ? ok<string, T>(handler(fieldValue))
        : defaultValue !== undefined
        ? ok<string, T>(defaultValue)
        : err<string, T>(
            `Переданное значение "${fieldValue}" не соответствует ни одному из позволенных [${availableTypesString}].`,
          );
    }

    return ok<string, T>(valueInMap);
  });
}
