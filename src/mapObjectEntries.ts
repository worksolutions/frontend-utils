export function mapObjectEntries<T, Z>(object: Record<string, T>, map: (pair: [string, T]) => [string, Z]) {
  return Object.fromEntries(Object.entries(object).map(map));
}
