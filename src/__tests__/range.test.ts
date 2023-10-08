import { range } from "../range";

test("range test", function () {
  expect(range(1, 4)).toStrictEqual([1, 2, 3]);
});
