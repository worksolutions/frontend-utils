import { arrangeArrayWith } from "../arrangeArrayWith";

test("arrange array with predicate", function () {
  const two = { name: "two", sortOrder: 2 };
  const four = { name: "four", sortOrder: 4 };
  const three = { name: "three", sortOrder: 3 };
  const one = { name: "one", sortOrder: 1 };

  const unsortedArray = [two, four, three, one];

  expect(arrangeArrayWith(unsortedArray, (item) => item.sortOrder)).toEqual([one, two, three, four]);
});
