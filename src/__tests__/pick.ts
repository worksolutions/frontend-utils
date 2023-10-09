import { pick } from "../pick";

test("pick test", function () {
  expect(pick(["a"], { a: 1, b: 2 })).toStrictEqual({ a: 1 });
});
