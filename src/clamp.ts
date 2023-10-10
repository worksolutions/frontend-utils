export function clamp(min: number, max: number, value: number) {
  if (min > max) throw new Error("min must not be greater than max in clamp(min, max, value)");
  return value < min ? min : value > max ? max : value;
}
