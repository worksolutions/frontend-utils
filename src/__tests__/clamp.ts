import { clamp } from "../clamp";

test("clamp test", function () {
  expect(clamp(1, 3, 0)).toBe(1);
  expect(clamp(1, 3, 1)).toBe(1);
  expect(clamp(1, 3, 2)).toBe(2);
  expect(clamp(1, 3, 3)).toBe(3);
  expect(clamp(1, 3, 4)).toBe(3);
});
