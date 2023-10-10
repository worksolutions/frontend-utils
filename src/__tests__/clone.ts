import { clone } from "../clone";

test("clone test", function () {
  const obj1 = { a: { b: { d: 4 } }, c: 2 };
  const arr1 = [1, { b: 2 }, obj1];

  const clonedObject = clone(obj1);
  const clonedArray = clone(arr1);

  expect(obj1 === clonedObject).toBe(false);
  expect(arr1 === clonedArray).toBe(false);

  expect(obj1.a === clonedObject.a).toBe(false);
  expect(obj1.a.b === clonedObject.a.b).toBe(false);
  expect(obj1.c === clonedObject.c).toBe(true);

  expect(arr1[1] === clonedArray[1]).toBe(false);
  expect(arr1[2] === clonedArray[2]).toBe(false);
  expect(obj1 === clonedArray[2]).toBe(false);
});
