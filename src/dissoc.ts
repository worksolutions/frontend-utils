export function dissoc(prop: string, obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const p in obj) {
    result[p] = obj[p];
  }

  delete result[prop];

  return result;
}
