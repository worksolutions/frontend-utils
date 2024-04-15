import { update } from "../update";

test("update test", function () {
  expect(update(2, "hello", ["a", "b", "c", "d"])).toStrictEqual(["a", "b", "hello", "d"]);
});
