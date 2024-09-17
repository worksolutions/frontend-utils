export function recursiveFind<
  SUB_ITEMS_FIELD_NAME extends string,
  ITEM extends object,
  INJECT_LEVEL extends boolean = false,
>(
  subItemsFieldName: SUB_ITEMS_FIELD_NAME,
  criteria: (item: ITEM) => any,
  items: ITEM[],
  injectLevel?: INJECT_LEVEL,
  level = 0,
): (INJECT_LEVEL extends true ? { level: number; item: ITEM } : ITEM) | undefined {
  for (const item of items) {
    if (criteria(item)) return injectLevel ? { level, item } : (item as any);
    if (subItemsFieldName in item && Array.isArray((item as any)[subItemsFieldName])) {
      const subItems = (item as any)[subItemsFieldName];
      if (subItems) {
        const foundInSubItems = recursiveFind(subItemsFieldName, criteria, subItems, injectLevel, level + 1);
        if (foundInSubItems) return foundInSubItems;
      }
    }
  }
}
