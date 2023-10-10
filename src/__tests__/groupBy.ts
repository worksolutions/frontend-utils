import { groupBy } from "../groupBy";

test("groupBy test", function () {
  expect(groupBy((element) => element[0], ["1one", "1two", "2three", "2four", "3five"])).toStrictEqual({
    "1": ["1one", "1two"],
    "2": ["2three", "2four"],
    "3": ["3five"],
  });
});
