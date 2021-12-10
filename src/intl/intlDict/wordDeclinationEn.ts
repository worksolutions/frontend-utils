export function wordDeclinationEn(number: number, titles: string[]) {
  return number === 1 ? titles[0] : titles[1];
}
