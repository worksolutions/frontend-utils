export function findElementInDOMParentTree(
  startElement: HTMLElement | null,
  checkFound: (element: HTMLElement) => boolean,
): HTMLElement | null {
  if (!startElement) return null;
  if (checkFound(startElement)) return startElement;
  return findElementInDOMParentTree(startElement.parentElement, checkFound);
}
