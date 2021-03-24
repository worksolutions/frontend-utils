export function template(text: string, keyMap: Record<string, string | number>) {
  return Object.keys(keyMap).reduce((prev, mapKey) => prev.replace(`{${mapKey}}`, keyMap[mapKey].toString()), text);
}
