import { ascend, prop } from "ramda";

export function arrangeArrayWith<ITEM>(items: ITEM[], getIndex: (item: ITEM, index: number) => number) {
  const indexes = items
    .map((item, index) => {
      const newIndex = getIndex(item, index);
      if (newIndex === -1) throw new Error("Function 'getIndex' returned -1");
      return { index: newIndex, item };
    })
    .sort(ascend(prop("index")));

  return indexes.map(prop("item"));
}
