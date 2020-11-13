import "moment/locale/ru";
import moment, { LocaleSpecification } from "moment";

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
