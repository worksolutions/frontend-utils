export function mapObjectEntries<OBJECT extends Record<string, any>>(
  object: OBJECT,
  map: <KEYS extends keyof OBJECT>(pair: [KEYS, OBJECT[KEYS]]) => readonly [string, OBJECT[KEYS]],
): OBJECT {
  return Object.fromEntries(Object.entries(object).map(map)) as any;
}
