import { isArray, isFunction, isNotNil, isNumber, isPureObject, isString } from "./is";

test("detect arrays", function () {
  expect(isArray([])).toBe(true);
  expect(isArray([{}])).toBe(true);
  expect(isArray({})).toBe(false);
  expect(isArray("asd")).toBe(false);
  expect(isArray(0)).toBe(false);
  expect(isArray(null)).toBe(false);
  expect(isArray(undefined)).toBe(false);
});

test("detect pure objects", function () {
  expect(isPureObject({})).toBe(true);
  expect(isPureObject([])).toBe(false);
  expect(isPureObject(1)).toBe(false);
  expect(isPureObject(null)).toBe(false);
  expect(isPureObject(undefined)).toBe(false);
});

test("detect numbers", function () {
  expect(isNumber(1)).toBe(true);
  expect(isNumber(NaN)).toBe(true);
  expect(isNumber("0")).toBe(false);
});

test("detect strings", function () {
  expect(isString("")).toBe(true);
  expect(isString(1)).toBe(false);
});

test("detect functions", function () {
  expect(isFunction(() => 1)).toBe(true);
  expect(isFunction(function () {})).toBe(true);
  expect(isFunction(1)).toBe(false);
});

test("detect not null and not undefined", function () {
  expect(isNotNil(null)).toBe(false);
  expect(isNotNil(undefined)).toBe(false);
  expect(isNotNil(1)).toBe(true);
});
