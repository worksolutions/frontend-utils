import { without } from "../without";

test("without test", function () {
  expect(without([3], [1, 2, 3, 4])).toStrictEqual([1, 2, 4]);
});
