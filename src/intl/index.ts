import { DateTime } from "luxon";
import { memoizeWith, path } from "ramda";

import { string1, string2 } from "../stringMemoHelper";
import { splitByPoint } from "../path";

export enum DateMode {
  DATE = "DATE",
  DAY_WITH_STRING_MONTH = "DAY_WITH_STRING_MONTH",
  DATE_WITH_STRING_MONTH = "DATE_WITH_STRING_MONTH",
  TIME = "TIME",
  DATE_TIME = "DATE_TIME",
  DATE_TIME_WITH_STRING_MONTH = "DATE_TIME_WITH_STRING_MONTH",
  HOURS = "HOURS",
  SHORT_HOURS = "SHORT_HOURS",
  MINUTES = "MINUTES",
  SHORT_MINUTES = "SHORT_MINUTES",
  __UNIVERSAL_ISO = "__UNIVERSAL_ISO",
  __UNIVERSAL_DATE = "__UNIVERSAL_DATE",
  __UNIVERSAL_TIME = "__UNIVERSAL_TIME",
  __UNIVERSAL_DATETIME = "__UNIVERSAL_DATETIME",
}

export interface IntlDictionaryInterface {
  languageCode: "ru" | "en";
  matchDateModeAndLuxonTypeLiteral: Record<DateMode, string>;
  textDictionary: Record<string, any>;
  decl: {
    dict: Record<string, any>;
    converter: (count: number, declValue: any) => string;
  };
}

export class INTL {
  static universalDates = {
    __UNIVERSAL_ISO: "",
    __UNIVERSAL_DATE: "dd.MM.yyyy",
    __UNIVERSAL_TIME: "HH:mm",
    __UNIVERSAL_DATETIME: "dd.MM.yyyy HH:mm",
  };

  private static makePathByStringWithDots<T extends string>(stringWithDots: string) {
    return path<T>(splitByPoint(stringWithDots));
  }

  currentDate: DateTime = null!;

  constructor(public config: IntlDictionaryInterface) {
    this.currentDate = DateTime.now().setLocale(config.languageCode);
  }

  formatDate = (date: DateTime, mode: DateMode) => date.toFormat(this.config.matchDateModeAndLuxonTypeLiteral[mode]);

  getDateTime = (text: string, mode: DateMode) =>
    DateTime.fromFormat(text, this.config.matchDateModeAndLuxonTypeLiteral[mode], { locale: this.config.languageCode });

  text = memoizeWith(string1, <T extends string>(pathString: string) =>
    INTL.makePathByStringWithDots<T>(pathString)(this.config.textDictionary),
  );

  decl = memoizeWith(string2, (count: number, pathString: string) => {
    const dict = INTL.makePathByStringWithDots(pathString)(this.config.decl.dict);
    return this.config.decl.converter(count, dict);
  });
}
