import { recursiveFind } from "../recursiveFind";

const id1 = { id: 1 };
const id5 = { id: 5 };
const id4 = { id: 4, items: [id5] };
const id2 = { id: 2, items: [id4] };
const id3 = { id: 3, items: [] };

const items = [id1, id2, id3];

test("recursiveFind", function () {
  expect(recursiveFind("items", (item) => item.id === 1, items)).toBe(id1);
  expect(recursiveFind("items", (item) => item.id === 2, items)).toBe(id2);
  expect(recursiveFind("items", (item) => item.id === 4, items)).toBe(id4);
  expect(recursiveFind("items", (item) => item.id === 5, items)).toBe(id5);
  expect(recursiveFind("items", (item) => item.id === 0, items)).toBe(undefined);
});
