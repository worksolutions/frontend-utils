import { memoizeWith, path } from "ramda";

import { string1, string2 } from "../../stringMemoHelper";
import { splitByPoint } from "../../path";

export interface IntlDictionaryInterface {
  textDictionary: Record<string, any>;
  decl: { dict: Record<string, any>; converter: (count: number, declValue: any) => string };
}

export class IntlDict {
  private static makePathByStringWithDots<T extends string>(stringWithDots: string) {
    return path<T>(splitByPoint(stringWithDots));
  }

  constructor(public config: IntlDictionaryInterface) {}

  text = memoizeWith(string1, <T extends string>(pathString: string) =>
    IntlDict.makePathByStringWithDots<T>(pathString)(this.config.textDictionary),
  );

  decl = memoizeWith(string2, (count: number, pathString: string) => {
    const dict = IntlDict.makePathByStringWithDots(pathString)(this.config.decl.dict);
    return this.config.decl.converter(count, dict);
  });
}

export * from "./wordDeclinationEn";
export * from "./wordDeclinationRu";
