import { ascend } from "./sort";

export function arrangeArrayWith<ITEM>(items: ITEM[], getIndex: (item: ITEM, index: number) => number) {
  const indexes = items
    .map((item, index) => {
      const newIndex = getIndex(item, index);
      if (newIndex === -1) throw new Error("Function 'getIndex' returned -1");
      return { index: newIndex, item };
    })
    .sort((a, b) => ascend(({ index }) => index, a, b));

  return indexes.map(({ item }) => item);
}
