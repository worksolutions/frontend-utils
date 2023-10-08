export function pick(names: string[], obj: Record<string, any>) {
  const result: Record<string, any> = {};
  let idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) result[names[idx]] = obj[names[idx]];
    idx += 1;
  }

  return result;
}
