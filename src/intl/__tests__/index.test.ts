import { DateMode, IntlDate, isDateAfter, isDateBefore, isDateSame } from "../intlDate";

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

test("INTL test", function () {
  const intl = getIntl();

  const testDate = intl.getDateTime("20.08.1997 08:04", DateMode.DATE_TIME);

  expect(intl.formatDate(testDate, DateMode.DATE)).toBe("20.08.1997");
  expect(intl.formatDate(testDate, DateMode.TIME)).toBe("08:04");
  expect(intl.formatDate(testDate, DateMode.DATE_TIME)).toBe("20.08.1997 08:04");
  expect(intl.formatDate(testDate, DateMode.DATE_WITH_STRING_MONTH)).toBe("20 августа 1997");
  expect(intl.formatDate(testDate, DateMode.DAY_WITH_STRING_MONTH)).toBe("20 августа");
  expect(intl.formatDate(testDate, DateMode.DATE_TIME_WITH_STRING_MONTH)).toBe("20 августа 1997 08:04");
  expect(intl.formatDate(testDate, DateMode.HOURS)).toBe("08");
  expect(intl.formatDate(testDate, DateMode.SHORT_HOURS)).toBe("8");
  expect(intl.formatDate(testDate, DateMode.MINUTES)).toBe("04");
  expect(intl.formatDate(testDate, DateMode.SHORT_MINUTES)).toBe("4");
});

test("INTL date utils - isDateBefore - days and years", function () {
  const intl = getIntl();

  const currentDay = intl.getDateTime("20.08.1997 09:00", DateMode.DATE_TIME);

  const currentDayPlusHour = currentDay.plus({ hours: 1 });
  const currentDayMinusHour = currentDay.minus({ hours: 1 });

  const nextDay = currentDay.plus({ days: 1 });
  const prevDay = currentDay.minus({ days: 1 });
  const next2Days = currentDay.plus({ days: 2 });
  const prev2Days = currentDay.minus({ days: 2 });
  const next2DaysAndHour = next2Days.plus({ hour: 1 });
  const prev2DaysAndHour = prev2Days.minus({ hour: 1 });
  const nextYear = currentDay.plus({ year: 1 });
  const prevYear = currentDay.minus({ year: 1 });
  const next2Years = currentDay.plus({ year: 2 });
  const prev2Years = currentDay.minus({ year: 2 });
  const next2YearsAndDay = next2Years.plus({ day: 1 });
  const prev2YearsAndDay = prev2Years.minus({ day: 1 });

  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay }, "years")).toBe(false);

  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayPlusHour })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayPlusHour }, "minutes")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayPlusHour }, "hours")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayPlusHour }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayMinusHour })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayMinusHour }, "minutes")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayMinusHour }, "hours")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDayMinusHour }, "days")).toBe(false);

  expect(isDateBefore({ value: currentDay, comparisonWith: nextDay })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextDay }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextDay }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Days })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Days }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Days }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2DaysAndHour })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2DaysAndHour }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2DaysAndHour }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextYear })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextYear }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextYear }, "years")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Years })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Years }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Years }, "years")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2YearsAndDay })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2YearsAndDay }, "days")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2YearsAndDay }, "years")).toBe(true);

  expect(isDateBefore({ value: currentDay, comparisonWith: prevDay })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevDay }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevDay }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Days })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Days }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Days }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2DaysAndHour })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2DaysAndHour }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2DaysAndHour }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevYear })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevYear }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevYear }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Years })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Years }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Years }, "years")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2YearsAndDay })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2YearsAndDay }, "days")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2YearsAndDay }, "years")).toBe(false);
});

test("INTL date utils - isDateAfter - days and years", function () {
  const intl = getIntl();

  const currentDay = intl.getDateTime("20.08.1997 09:00", DateMode.DATE_TIME);

  const currentDayPlusHour = currentDay.plus({ hours: 1 });
  const currentDayMinusHour = currentDay.minus({ hours: 1 });

  const nextDay = currentDay.plus({ days: 1 });
  const prevDay = currentDay.minus({ days: 1 });
  const next2Days = currentDay.plus({ days: 2 });
  const prev2Days = currentDay.minus({ days: 2 });
  const next2DaysAndHour = next2Days.plus({ hour: 1 });
  const prev2DaysAndHour = prev2Days.minus({ hour: 1 });
  const nextYear = currentDay.plus({ year: 1 });
  const prevYear = currentDay.minus({ year: 1 });
  const next2Years = currentDay.plus({ year: 2 });
  const prev2Years = currentDay.minus({ year: 2 });
  const next2YearsAndDay = next2Years.plus({ day: 1 });
  const prev2YearsAndDay = prev2Years.minus({ day: 1 });

  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay }, "years")).toBe(false);

  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayPlusHour })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayPlusHour }, "minutes")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayPlusHour }, "hours")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayPlusHour }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayMinusHour })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayMinusHour }, "minutes")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayMinusHour }, "hours")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDayMinusHour }, "days")).toBe(false);

  expect(isDateAfter({ value: currentDay, comparisonWith: nextDay })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextDay }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextDay }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Days })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Days }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Days }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2DaysAndHour })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2DaysAndHour }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2DaysAndHour }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextYear })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextYear }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextYear }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Years })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Years }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Years }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2YearsAndDay })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2YearsAndDay }, "days")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2YearsAndDay }, "years")).toBe(false);

  expect(isDateAfter({ value: currentDay, comparisonWith: prevDay })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevDay }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevDay }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Days })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Days }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Days }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2DaysAndHour })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2DaysAndHour }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2DaysAndHour }, "years")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevYear })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevYear }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevYear }, "years")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Years })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Years }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Years }, "years")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2YearsAndDay })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2YearsAndDay }, "days")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2YearsAndDay }, "years")).toBe(true);
});

test("INTL date utils - isDateSame - days and years", function () {
  const intl = getIntl();

  const currentDay = intl.getDateTime("20.08.1997 09:00", DateMode.DATE_TIME);

  const currentDayPlusHour = currentDay.plus({ hour: 1 });

  const nextDay = currentDay.plus({ days: 1 });
  const prevDay = currentDay.minus({ days: 1 });

  expect(isDateSame({ value: currentDay, comparisonWith: currentDay })).toBe(true);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDay }, "days")).toBe(true);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDay }, "years")).toBe(true);

  expect(isDateSame({ value: currentDay, comparisonWith: currentDayPlusHour })).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDayPlusHour }, "minutes")).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDayPlusHour }, "hours")).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDayPlusHour }, "days")).toBe(true);
  expect(isDateSame({ value: currentDay, comparisonWith: currentDayPlusHour }, "years")).toBe(true);

  expect(isDateSame({ value: currentDay, comparisonWith: nextDay })).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: nextDay }, "days")).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: nextDay }, "years")).toBe(true);

  expect(isDateSame({ value: currentDay, comparisonWith: prevDay })).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: prevDay }, "days")).toBe(false);
  expect(isDateSame({ value: currentDay, comparisonWith: prevDay }, "years")).toBe(true);
});

test("INTL date utils - isDateBefore - hours", function () {
  const intl = getIntl();

  const currentDay = intl.getDateTime("20.08.1997 09:00", DateMode.DATE_TIME);

  const nextHour = currentDay.plus({ hours: 1 });
  const prevHour = currentDay.minus({ hours: 1 });
  const next2Hours = currentDay.plus({ hour: 2 });
  const prev2Hours = currentDay.minus({ hour: 2 });

  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay }, "hours")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: currentDay }, "minutes")).toBe(false);

  expect(isDateBefore({ value: currentDay, comparisonWith: nextHour })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextHour }, "minutes")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: nextHour }, "hours")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Hours })).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Hours }, "minutes")).toBe(true);
  expect(isDateBefore({ value: currentDay, comparisonWith: next2Hours }, "hours")).toBe(true);

  expect(isDateBefore({ value: currentDay, comparisonWith: prevHour })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevHour }, "minutes")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prevHour }, "hours")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Hours })).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Hours }, "minutes")).toBe(false);
  expect(isDateBefore({ value: currentDay, comparisonWith: prev2Hours }, "hours")).toBe(false);
});

test("INTL date utils - isDateAfter - hours", function () {
  const intl = getIntl();

  const currentDay = intl.getDateTime("20.08.1997 09:00", DateMode.DATE_TIME);

  const nextHour = currentDay.plus({ hours: 1 });
  const prevHour = currentDay.minus({ hours: 1 });
  const next2Hours = currentDay.plus({ hour: 2 });
  const prev2Hours = currentDay.minus({ hour: 2 });

  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay }, "hours")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: currentDay }, "minutes")).toBe(false);

  expect(isDateAfter({ value: currentDay, comparisonWith: nextHour })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextHour }, "minutes")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: nextHour }, "hours")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Hours })).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Hours }, "minutes")).toBe(false);
  expect(isDateAfter({ value: currentDay, comparisonWith: next2Hours }, "hours")).toBe(false);

  expect(isDateAfter({ value: currentDay, comparisonWith: prevHour })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevHour }, "minutes")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prevHour }, "hours")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Hours })).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Hours }, "minutes")).toBe(true);
  expect(isDateAfter({ value: currentDay, comparisonWith: prev2Hours }, "hours")).toBe(true);
});

test("INTL date zones", function () {
  const intl = getIntl();
  const dateTime = intl.getDateTime("10.10.2020 10:00", "DATE_TIME", "UTC");
  expect(dateTime.hour).toBe(10);
  expect(dateTime.setZone("Europe/Moscow").hour).toBe(13);
});

test("INTL iso and utc", function () {
  const intl = getIntl();
  const isoString = "2022-02-21T07:17:31.072Z";

  const dateTimeIso = intl.getDateTime(isoString, DateMode.__UNIVERSAL_ISO);
  const dateTimeIsoZoneUTC = intl.getDateTime(isoString, DateMode.__UNIVERSAL_ISO, "utc");

  expect(intl.formatDate(dateTimeIso, DateMode.DATE_TIME)).toBe("21.02.2022 10:17");
  expect(intl.formatDate(dateTimeIsoZoneUTC, DateMode.DATE_TIME)).toBe("21.02.2022 07:17");
});
