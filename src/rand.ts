// in range [min, max)
export function getRandomIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
