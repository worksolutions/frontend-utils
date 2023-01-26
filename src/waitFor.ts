import { setAsyncInterval } from "./setAsyncInterval";

export function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeoutMS: number,
  checkIntervalMS = 100,
): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (await condition()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const stopTimer = setAsyncInterval(async () => {
      if (await condition()) {
        stopTimer();
        resolve();
        return;
      }

      if (Date.now() - startTime > timeoutMS) {
        stopTimer();
        reject(new Error("waitFor timeout"));
      }
    }, checkIntervalMS);
  });
}
