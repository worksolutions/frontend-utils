import { mergeDeepRight } from "../mergeDeep";

test("merge deep test", function () {
  const left = { a: { b: 1 }, c: 2 };
  const right = { a: { b: 3 }, d: 4 };
  expect(mergeDeepRight(left, right)).toEqual({ a: { b: 3 }, c: 2, d: 4 });
  expect(left).toEqual({ a: { b: 1 }, c: 2 });
  expect(right).toEqual({ a: { b: 3 }, d: 4 });
});
