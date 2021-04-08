export async function promiseSerial<T>(promiseMakers: (() => T)[]) {
  const results: T[] = [];
  for (let i = 0; i < promiseMakers.length; i++) {
    results.push(await promiseMakers[i]());
  }
  return results;
}
