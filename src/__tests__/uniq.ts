import { uniq } from "../uniq";

test("uniq test", function () {
  expect(uniq([1, 2, 3, 3, 4])).toStrictEqual([1, 2, 3, 4]);
});
