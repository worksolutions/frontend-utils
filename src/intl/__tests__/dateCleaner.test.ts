import { DateMode, IntlDate, isDateSame, cleanDateByPrecision } from "../intlDate";

function getIntl() {
  return new IntlDate({
    languageCode: "ru",
    matchDateModeAndLuxonTypeLiteral: {
      DAY_WITH_STRING_MONTH: "dd MMMM",
      DAY_WITH_STRING_SHORT_MONTH: "dd MMM",
      DATE: "dd.MM.yyyy",
      DATE_WITH_STRING_MONTH: "dd MMMM yyyy",
      DATE_WITH_STRING_SHORT_MONTH: "dd MMM yyyy",
      TIME: "HH:mm",
      TIME_WITH_SECONDS: "HH:mm:ss",
      DATE_TIME: "dd.MM.yyyy HH:mm",
      DATE_TIME_WITH_SECONDS: "dd.MM.yyyy HH:mm:ss",
      DATE_TIME_WITH_STRING_MONTH: "dd MMMM yyyy HH:mm",
      DATE_TIME_WITH_STRING_MONTH_WITH_SECONDS: "dd MMMM yyyy HH:mm:ss",
      DATE_TIME_WITH_STRING_SHORT_MONTH: "dd MMM yyyy HH:mm",
      DATE_TIME_WITH_STRING_SHORT_MONTH_WITH_SECONDS: "dd MMM yyyy HH:mm:ss",
      HOURS: "HH",
      SHORT_HOURS: "H",
      MINUTES: "mm",
      SHORT_MINUTES: "m",
      ...IntlDate.universalDates,
    },
  });
}

test("date cleaner", function () {
  const intl = getIntl();

  const viewDateTime = intl.getDateTime("20.08.1997 15:14:13:120", "dd.MM.yyyy HH:mm:ss:SSS");

  expect(viewDateTime.year).toBe(1997);
  expect(viewDateTime.month).toBe(8);
  expect(viewDateTime.day).toBe(20);
  expect(viewDateTime.hour).toBe(15);
  expect(viewDateTime.minute).toBe(14);
  expect(viewDateTime.second).toBe(13);
  expect(viewDateTime.millisecond).toBe(120);

  expect(cleanDateByPrecision("second", viewDateTime).millisecond).toBe(0);
  expect(cleanDateByPrecision("second", viewDateTime).second).toBe(13);
  expect(cleanDateByPrecision("second", viewDateTime).minute).toBe(14);
});

test("INTL same with precision", function () {
  const intl = getIntl();

  const viewDateTime = intl.getDateTime("20.08.1997 14:00", DateMode.DATE_TIME);
  const selectedDateTime = intl.getDateTime(
    `${viewDateTime.day.toString().padStart(2, "0")}.${viewDateTime.month.toString().padStart(2, "0")}.${
      viewDateTime.year
    }`,
    DateMode.DATE,
  );

  expect(isDateSame({ value: viewDateTime, comparisonWith: selectedDateTime }, "day")).toBe(true);
  expect(isDateSame({ value: viewDateTime.minus({ day: 1 }), comparisonWith: selectedDateTime }, "day")).toBe(false);
  expect(isDateSame({ value: viewDateTime.plus({ day: 1 }), comparisonWith: selectedDateTime }, "day")).toBe(false);
});
