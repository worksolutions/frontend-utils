export function update<T>(index: number, value: T, target: T[]): T[] {
  return [...target.slice().slice(0, index), value, ...target.slice().slice(index + 1)];
}
