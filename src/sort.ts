export function ascend<T>(fn: (a: T) => number, a: T, b: T) {
  const aValue = fn(a);
  const bValue = fn(b);
  return aValue < bValue ? -1 : bValue < aValue ? 1 : 0;
}

export function descend<T>(fn: (a: T) => number, a: T, b: T) {
  const aValue = fn(a);
  const bValue = fn(b);
  return aValue > bValue ? -1 : bValue > aValue ? 1 : 0;
}
