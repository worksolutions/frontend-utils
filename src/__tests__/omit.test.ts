import { omit } from "../omit";

test("omit test", function () {
  expect(omit(["a"], { a: 1, b: 2 })).toStrictEqual({ b: 2 });
});
