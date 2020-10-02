export function htmlCollectionToArray(collection: HTMLCollection) {
  return Array.of(...collection) as HTMLElement[];
}
