export interface TemplateOptionsInterface {
  openingSymbol: string;
  closingSymbol: string;
}

const defaultOptions: TemplateOptionsInterface = { openingSymbol: "{", closingSymbol: "}" };

export function template(
  text: string,
  keyMap: Record<string, string | number>,
  { openingSymbol, closingSymbol } = defaultOptions,
) {
  return Object.keys(keyMap).reduce((prev, mapKey) => {
    const regExp = new RegExp(`${openingSymbol}${mapKey}${closingSymbol}`, "g");
    return prev.replace(regExp, keyMap[mapKey].toString());
  }, text);
}
