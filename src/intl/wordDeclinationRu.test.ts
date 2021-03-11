import { wordDeclinationRu } from "./wordDeclinationRu";

test("RU word declination function", function () {
  const titles = ["месяц", "месяца", "месяцев"];
  expect(wordDeclinationRu(1, titles)).toBe("месяц");
  expect(wordDeclinationRu(2, titles)).toBe("месяца");
  expect(wordDeclinationRu(6, titles)).toBe("месяцев");
  expect(wordDeclinationRu(26, titles)).toBe("месяцев");
});
