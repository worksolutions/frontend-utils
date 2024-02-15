export function memoizeWith<FUNC extends (...args: any[]) => unknown>(
  keyFunction: (...v: Parameters<FUNC>) => string | number | symbol,
  func: FUNC,
): FUNC {
  const cache: Record<string | number | symbol, any> = {};
  return function (this: any, ...args: Parameters<FUNC>) {
    const key = keyFunction.apply(this, args);
    if (!(key in cache)) cache[key] = func.apply(this, args);
    return cache[key];
  } as FUNC;
}
