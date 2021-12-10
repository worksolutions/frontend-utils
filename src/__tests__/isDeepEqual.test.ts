import { isDeepEqual } from "../isDeepEqual";

test("Deep equals primitives", function () {
  expect(isDeepEqual(1, 1)).toBe(true);
  expect(isDeepEqual(0, 1)).toBe(false);
  expect(isDeepEqual("asd", "asd")).toBe(true);
  expect(isDeepEqual(undefined, undefined)).toBe(true);
  expect(isDeepEqual(undefined, null)).toBe(false);
});

test("Deep equals objects", function () {
  expect(isDeepEqual({}, {})).toBe(true);
  expect(isDeepEqual([], [])).toBe(true);
  expect(isDeepEqual([{ d: { z: { q: 1 } } }], [{ d: { z: { q: 1 } } }])).toBe(true);
  expect(isDeepEqual([], null)).toBe(false);
});
