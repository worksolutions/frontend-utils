export function memoizeWith<T extends (...args: any[]) => unknown>(
  keyFunction: (...v: Parameters<T>) => string,
  func: T,
): T {
  const cache: Record<string, any> = {};
  return function (this: any, ...args: Parameters<T>) {
    const key = keyFunction.apply(this, args);
    if (!(key in cache)) cache[key] = func.apply(this, args);
    return cache[key];
  } as T;
}
