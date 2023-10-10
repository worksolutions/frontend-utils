export function groupBy<KEYS extends string, ELEMENTS>(getKey: (element: ELEMENTS) => KEYS, elements: ELEMENTS[]) {
  return elements.reduce((acc, element) => {
    const key = getKey(element);
    acc[key] = acc[key] || [];
    acc[key].push(element);
    return acc;
  }, {} as { [key in KEYS]: ELEMENTS[] });
}
