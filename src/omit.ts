export function omit(excludeObjectKeys: string[], obj: Record<string, any>) {
  const result: Record<string, any> = {};
  const index: Record<string, any> = {};
  let idx = 0;
  const length = excludeObjectKeys.length;

  while (idx < length) {
    index[excludeObjectKeys[idx]] = 1;
    idx += 1;
  }

  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (!index.hasOwnProperty(prop)) result[prop] = obj[prop];
  }

  return result;
}
