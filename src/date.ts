import "moment/locale/ru";
import moment, { LocaleSpecification, Moment } from "moment";
import { sort } from "ramda";

// @ts-ignore
const config = moment.localeData("ru")["_config"] as LocaleSpecification;

const weekdaysShort: string[] = config.weekdaysShort as any;

moment.updateLocale("ru", {
  calendar: {
    ...config.calendar,
  },
  week: {
    dow: 1,
  },
  weekdaysShort: [weekdaysShort[1], ...weekdaysShort.slice(2), weekdaysShort[0]],
});

export enum DateMode {
  DAY_MONTH_YEAR = "DD MMMM YYYY",
  DAY_MONTH_YEAR_TIME = "DD MMMM YYYY HH:mm",
  DAY_MONTH = "DD MMMM",
  DATE = "DD.MM.YYYY",
  TIME = "HH:mm",
  DATE_TIME = "DD.MM.YYYY HH:mm",
  DATE_TIME_WITH_SECONDS = "DD.MM.YYYY HH:mm:ss",
  DATE_TIME_WITH_MILLI_SECONDS = "DD.MM.YYYY HH:mm:ss:SSS",
  YEAR_AND_QUARTER = "YYYY.Q",
  HUMANABLE_DATE_TIME_WITHOUT_YEAR = "D MMMM в HH:mm",
}

export const sortDates = (dates: Moment[]): Moment[] => sort((a: Moment, b: Moment) => a.diff(b), dates);

export const now = moment();
