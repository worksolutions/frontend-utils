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
  __UNIVERSAL_DATE = "__UNIVERSAL_DATE",
  __UNIVERSAL_TIME = "__UNIVERSAL_TIME",
  __UNIVERSAL_DATETIME = "__UNIVERSAL_DATETIME",
}

export interface IntlDateDictionaryInterface {
  languageCode: string;
  matchDateModeAndLuxonTypeLiteral: Record<DateMode, string>;
}

export class IntlDate {
  static universalDates = {
    __UNIVERSAL_ISO: "",
    __UNIVERSAL_DATE: "dd.MM.yyyy",
    __UNIVERSAL_TIME: "HH:mm",
    __UNIVERSAL_DATETIME: "dd.MM.yyyy HH:mm",
  };

  private buildCurrentDate(config: IntlDateDictionaryInterface) {
    this.currentDate = DateTime.now().set({ millisecond: 0 }).setLocale(config.languageCode);
  }

  currentDate: DateTime = null!;

  constructor(public config: IntlDateDictionaryInterface) {
    this.buildCurrentDate(config);
  }

  private getFormat(mode: DateMode | string) {
    const matches = this.config.matchDateModeAndLuxonTypeLiteral;
    if (mode in matches) return matches[mode as DateMode];
    return mode.toString();
  }

  formatDate = (date: DateTime, mode: DateMode | string) => {
    if (mode === DateMode.__UNIVERSAL_ISO) return date.toISO({});
    return date.toFormat(this.getFormat(mode), { locale: this.config.languageCode });
  };

  localeString = (date: DateTime, options?: DateTimeFormatOptions) => date.toLocaleString(options);

  getDateTime = (text: string, mode: DateMode | string, zone?: string | Zone) => {
    const options: DateTimeOptions = { locale: this.config.languageCode };
    if (mode === DateMode.__UNIVERSAL_ISO) return DateTime.fromISO(text, { ...options, zone: zone || "UTC" });
    return DateTime.fromFormat(text, this.getFormat(mode), { ...options, zone });
  };

  rebuildCurrentDate = () => this.buildCurrentDate(this.config);
}

export * from "./dateCleaner";
export * from "./dateUtils";
