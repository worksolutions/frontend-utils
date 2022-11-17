import { DateTime, DateTimeFormatOptions, DateTimeOptions, Zone } from "luxon";

export enum DateMode {
  DATE = "DATE",
  DAY_WITH_STRING_MONTH = "DAY_WITH_STRING_MONTH",
  DAY_WITH_STRING_SHORT_MONTH = "DAY_WITH_STRING_SHORT_MONTH",
  DATE_WITH_STRING_SHORT_MONTH = "DATE_WITH_STRING_SHORT_MONTH",
  DATE_WITH_STRING_MONTH = "DATE_WITH_STRING_MONTH",
  TIME = "TIME",
  TIME_WITH_SECONDS = "TIME_WITH_SECONDS",
  DATE_TIME = "DATE_TIME",
  DATE_TIME_WITH_SECONDS = "DATE_TIME_WITH_SECONDS",
  DATE_TIME_WITH_STRING_MONTH = "DATE_TIME_WITH_STRING_MONTH",
  DATE_TIME_WITH_STRING_MONTH_WITH_SECONDS = "DATE_TIME_WITH_STRING_MONTH_WITH_SECONDS",
  DATE_TIME_WITH_STRING_SHORT_MONTH = "DATE_TIME_WITH_STRING_SHORT_MONTH",
  DATE_TIME_WITH_STRING_SHORT_MONTH_WITH_SECONDS = "DATE_TIME_WITH_STRING_SHORT_MONTH_WITH_SECONDS",
  HOURS = "HOURS",
  SHORT_HOURS = "SHORT_HOURS",
  MINUTES = "MINUTES",
  SHORT_MINUTES = "SHORT_MINUTES",
  __UNIVERSAL_ISO = "__UNIVERSAL_ISO",
}

export interface IntlDateDictionaryInterface {
  languageCode: string;
  matchDateModeAndLuxonTypeLiteral: Record<DateMode, string | Symbol>;
}

export class IntlDate {
  static universalDates = {
    __UNIVERSAL_ISO: Symbol(),
  };

  private buildCurrentDate(config: IntlDateDictionaryInterface) {
    this.currentDate = DateTime.now().set({ millisecond: 0 }).setLocale(config.languageCode);
  }

  currentDate: DateTime = null!;

  constructor(public config: IntlDateDictionaryInterface) {
    this.buildCurrentDate(config);
  }

  getDateTimeFormat(mode: string) {
    const matches = this.config.matchDateModeAndLuxonTypeLiteral;
    if (mode in matches) return matches[mode as DateMode] as string;
    return mode.toString();
  }

  formatDate = (date: DateTime, mode: DateMode | string) => {
    switch (mode) {
      case DateMode.__UNIVERSAL_ISO:
        return date.toISO({});
      default:
        return date.toFormat(this.getDateTimeFormat(mode), { locale: this.config.languageCode });
    }
  };

  localeString = (date: DateTime, options?: DateTimeFormatOptions) => date.toLocaleString(options);

  getDateTime = (text: string, mode: DateMode | string, zone?: string | Zone) => {
    const options: DateTimeOptions = { locale: this.config.languageCode, zone };

    switch (mode) {
      case DateMode.__UNIVERSAL_ISO:
        return DateTime.fromISO(text, options);
      default:
        return DateTime.fromFormat(text, this.getDateTimeFormat(mode), options);
    }
  };

  rebuildCurrentDate = () => this.buildCurrentDate(this.config);
}

export * from "./dateCleaner";
export * from "./dateUtils";
