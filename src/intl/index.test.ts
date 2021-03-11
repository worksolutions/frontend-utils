import { DateMode, INTL } from "./index";
import { wordDeclinationRu } from "./wordDeclinationRu";

test("INTL test", function () {
  const intl = new INTL({
    languageCode: "ru",
    decl: { dict: {}, converter: wordDeclinationRu },
    textDictionary: {},
    matchDateModeAndLuxonTypeLiteral: {
      DAY_WITH_STRING_MONTH: "dd MMMM",
      DATE: "dd.MM.yyyy",
      DATE_WITH_STRING_MONTH: "dd MMMM yyyy",
      TIME: "HH:mm",
      DATE_TIME: "dd.MM.yyyy HH:mm",
      DATE_TIME_WITH_STRING_MONTH: "dd MMMM yyyy HH:mm",
      HOURS: "HH",
      SHORT_HOURS: "H",
      MINUTES: "mm",
      SHORT_MINUTES: "m",
      ...INTL.universalDates,
    },
  });

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
