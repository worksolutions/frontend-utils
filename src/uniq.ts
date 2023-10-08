import { identity } from "./identity";

export function uniqBy<T, U>(fn: (a: T) => U, list: T[]): T[] {
  const set = new Set<U>();
  const result: T[] = [];
  list.forEach((item) => {
    const resultItem = fn(item);
    if (set.has(resultItem)) return;
    result.push(item);
    set.add(resultItem);
  });

  return result;
}

export function uniq<T>(list: T[]): T[] {
  return uniqBy(identity, list);
}
