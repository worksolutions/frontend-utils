export function asyncTimeout<T>(timeout: number, value?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, timeout, value);
  });
}
