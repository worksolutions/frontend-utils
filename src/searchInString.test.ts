import { searchInString } from "./searchInString";

test("searchInString", function () {
  expect(searchInString("some string with hello word", "hello")).toBe(true);
  expect(searchInString("not important", "123")).toBe(false);
  expect(searchInString("not important", "123", 4)).toBe(true);
  expect(searchInString(" hello world     ", "    wOrlD   ")).toBe(true);
});
