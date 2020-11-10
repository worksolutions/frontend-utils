import { memoizeWith } from "ramda";

export function memoizeWithContext<T extends (this: any, ...args: readonly any[]) => any>(
  keyFn: (this: any, ...v: Parameters<T>) => string,
  fn: T,
): T {
  const context = {};
  const keyFnWithContext = keyFn.bind(context) as (...v: Parameters<T>) => string;
  const fnWithContext = fn.bind(context) as T;
  return memoizeWith(keyFnWithContext, fnWithContext);
}
