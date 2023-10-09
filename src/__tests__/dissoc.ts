import { dissoc } from "../dissoc";

test("dissoc test", function () {
  const obj = { a: 3, b: 4 };
  expect(dissoc("a", obj)).toStrictEqual({ b: 4 });
  expect(obj).toStrictEqual({ a: 3, b: 4 });
});
