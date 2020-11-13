export function string1(a: any) {
  return String(a);
}

export function string2(a: any, b: any) {
  return string1(a) + string1(b);
}

export function string3(a: any, b: any, c: any) {
  return string1(a) + string1(b) + string1(c);
}
