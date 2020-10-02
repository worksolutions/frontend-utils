import "moment/locale/ru";
import moment, { LocaleSpecification, Moment, unitOfTime } from "moment";
import { sort, uniqWith } from "ramda";

export enum DateMode {
  DAY_MONTH_YEAR = "DD MMMM YYYY",
  DAY_MONTH_YEAR_TIME = "DD MMMM YYYY HH:mm",
  DAY_MONTH = "DD MMMM",
  DAY_MONTH_SHORT = "DD.MM",
  DATE = "DD.MM.YYYY",
  DATE_WITH_SLASHES = "DD/MM/YYYY",
  UTC = "YYYY.MM.DD HH:mm:ss UTC-0000",
  UTC_PROXY_SERVER = "YYYY-MM-DDTHH:mm:ss",
  TIME = "HH:mm",
  TIME_WITH_SECONDS = "HH:mm:ss",
  DATE_TIME = "DD.MM.YYYY HH:mm",
  DATE_TIME_WITH_SECONDS = "DD.MM.YYYY HH:mm:ss",
  DATE_TIME_WITH_MILLI_SECONDS = "DD.MM.YYYY HH:mm:ss:SSS",
  YEAR_AND_QUARTER = "YYYY.Q",
  SERVER_YEAR_AND_QUARTER = "YYYY~Q",
  HUMANABLE_DATE_TIME_WITHOUT_YEAR = "D MMMM в HH:mm",
}

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

export function momentFromLocalString(value: string, mode: DateMode = DateMode.DATE) {
  return moment(value, mode);
}

export const sortDates = (dates: Moment[]): Moment[] => sort((a: Moment, b: Moment) => a.diff(b), dates);

export const uniqDatesBy = (by?: unitOfTime.StartOf) => (dates: Moment[]): Moment[] =>
  uniqWith((prevDate, currDate) => prevDate.isSame(currDate, by), dates);

export const currentDateIsBetweenDates = (start: Moment, end: Moment) => moment().isBetween(start, end);

export function convertMomentToStartDateModeInterval(date: Moment, mode: DateMode) {
  return moment(date.format(mode), mode);
}

export const changeFormatMoment = (initialFormat: DateMode, convertFormat: DateMode) => (date: Moment) =>
  moment(date.format(initialFormat), convertFormat);

export const now = moment();
