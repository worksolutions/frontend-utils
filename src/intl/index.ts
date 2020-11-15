import moment, { Moment } from "moment";
import { memoizeWith, path } from "ramda";

import { string1, string2 } from "../stringMemoHelper";
import { splitByPoint } from "../path";

export interface IntlDictionaryInterface {
  momentLanguageCode: "ru" | "en";
  dateConverterMap: Record<DateMode, string>;
  textDictionary: Record<string, any>;
  decl: {
    dict: Record<string, any>;
    converter: (count: number, declValue: any) => string;
  };
}

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
  __UNIVERSAL_DATE = "__UNIVERSAL_DATE",
  __UNIVERSAL_TIME = "__UNIVERSAL_TIME",
  __UNIVERSAL_DATETIME = "__UNIVERSAL_DATETIME",
}

export class INTL {
  static universalDates = {
    __UNIVERSAL_DATE: "DD.MM.YYYY",
    __UNIVERSAL_TIME: "HH:mm",
    __UNIVERSAL_DATETIME: "DD.MM.YYYY HH:mm",
  };

  private static callMomentUpdaters = {
    ru: () => import("../date/updater-ru"),
    en: () => null,
  };

  private static makePathByStringWithDots<T extends string>(stringWithDots: string) {
    return path<T>(splitByPoint(stringWithDots));
  }

  currentLocalDate: Moment = null!;

  constructor(public config: IntlDictionaryInterface) {}

  async init() {
    const updater = INTL.callMomentUpdaters[this.config.momentLanguageCode];
    if (updater) await updater();
    moment.locale(this.config.momentLanguageCode);
    this.currentLocalDate = moment();
  }

  getDateMode = (mode: DateMode) => this.config.dateConverterMap[mode];

  date = (date: Moment, mode: DateMode) => date.format(this.getDateMode(mode));

  text = memoizeWith(string1, <T extends string>(pathString: string) =>
    INTL.makePathByStringWithDots<T>(pathString)(this.config.textDictionary),
  );

  decl = memoizeWith(string2, (count: number, pathString: string) => {
    const dict = INTL.makePathByStringWithDots(pathString)(this.config.decl.dict);
    return this.config.decl.converter(count, dict);
  });
}