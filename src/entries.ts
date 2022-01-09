export function entries<OBJ extends object, KEYS extends keyof OBJ>(obj: OBJ) {
  return Object.entries(obj) as { [key in KEYS]: [key, OBJ[key]] }[KEYS][];
}
