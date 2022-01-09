export function findByPredicate<ITEM, RESULT>(
  callback: (item: ITEM, index: number) => RESULT | undefined,
  items: Array<ITEM>,
) {
  for (const [index, item] of items.entries()) {
    const result = callback(item, index);
    if (result) return { item, result, index };
  }
}

export async function findByAsyncPredicate<ITEM, RESULT>(
  callback: (item: ITEM, index: number) => Promise<RESULT | undefined>,
  items: Array<ITEM>,
) {
  for (const [index, item] of items.entries()) {
    const result = await callback(item, index);
    if (result) return { item, result, index };
  }
}
