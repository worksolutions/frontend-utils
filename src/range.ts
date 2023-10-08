export function range(from: number, to: number) {
  const result = [];
  let n = from;

  while (n < to) {
    result.push(n);
    n += 1;
  }

  return result;
}
