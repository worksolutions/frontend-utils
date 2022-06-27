export function template(text: string, keyMap: Record<string, string | number>) {
  return Object.keys(keyMap).reduce(
    (prev, mapKey) => prev.replace(new RegExp(`{${mapKey}}`, "g"), keyMap[mapKey].toString()),
    text,
  );
}
