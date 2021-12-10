import { path, splitByPoint } from "../path";

test("path utils - 'splitByPoint'", function () {
  expect(splitByPoint("1.2.a")).toStrictEqual(["1", "2", "a"]);
  expect(splitByPoint("123")).toStrictEqual(["123"]);
  expect(splitByPoint("")).toStrictEqual([""]);
});

test("path utils - 'path'", function () {
  expect(path("a.b.c", { a: { b: { c: 1 } } })).toBe(1);
  expect(path("a.b", { a: { b: { c: 1 } } })).toStrictEqual({ c: 1 });
  expect(path("a.b.z", { a: {} })).toBe(undefined);
  expect(path("a.0.z", { a: [{ z: "hello" }] })).toBe("hello");
  expect(path(["a", 0, "0", "z"], { a: [[{ z: "hello" }]] })).toBe("hello");
});
