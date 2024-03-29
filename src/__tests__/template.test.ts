import { template } from "../template";

test("template replacer test", function () {
  expect(template("hello {num} world", { num: 1 })).toBe("hello 1 world");
  expect(template("hello %num% world", { num: 1 }, { openingSymbol: "%", closingSymbol: "%" })).toBe("hello 1 world");
});
