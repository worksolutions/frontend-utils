import { digitOnly } from "../digitOnly";

test("digitOnly function", function () {
  expect(digitOnly("123hello456")).toBe("123456");
  expect(digitOnly("")).toBe("");
  expect(digitOnly("zzzzz")).toBe("");
});
