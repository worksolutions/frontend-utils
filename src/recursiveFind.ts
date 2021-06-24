export function recursiveFind<SUB_ITEMS_FIELD_NAME extends string, ITEM extends Object>(
  subItemsFieldName: SUB_ITEMS_FIELD_NAME,
  criteria: (item: ITEM) => any,
  items: ITEM[],
): ITEM | undefined {
  for (const item of items) {
    if (criteria(item)) return item;
    if (subItemsFieldName in item) {
      const foundInSubItems = recursiveFind(subItemsFieldName, criteria, (item as any)[subItemsFieldName]);
      if (foundInSubItems) return foundInSubItems;
    }
  }
}
