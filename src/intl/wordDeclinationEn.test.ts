import { wordDeclinationEn } from "./wordDeclinationEn";

test("EN word declination function", function () {
  const titles = ["month", "months"];
  expect(wordDeclinationEn(1, titles)).toBe("month");
  expect(wordDeclinationEn(2, titles)).toBe("months");
  expect(wordDeclinationEn(6, titles)).toBe("months");
  expect(wordDeclinationEn(0, titles)).toBe("months");
  expect(wordDeclinationEn(26, titles)).toBe("months");
});
