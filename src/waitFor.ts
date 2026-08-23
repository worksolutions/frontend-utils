import { setAsyncInterval } from "./setAsyncInterval";

type Options = { abortSignal?: AbortSignal; timeoutMS?: number; checkIntervalMS?: number };

export function waitFor(
  condition: () => boolean | Promise<boolean>,
  { abortSignal, timeoutMS = Infinity, checkIntervalMS = 100 }: Options = {},
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (abortSignal?.aborted) return reject(new Error("Aborted"));
    try {
      if (await condition()) return resolve();
    } catch (e) {
      return reject(e);
    }

    const startTime = waitForInternalNow();
    const stopTimer = setAsyncInterval(async () => {
      if (abortSignal?.aborted) return;

      try {
        if (await condition()) {
          stopTimer();
          resolve();
          return;
        }
      } catch (e) {
        stopTimer();
        return reject(e);
      }

      if (waitForInternalNow() - startTime > timeoutMS) {
        stopTimer();
        reject(new Error("Timeout"));
      }
    }, checkIntervalMS);

    abortSignal?.addEventListener("abort", () => {
      stopTimer();
      reject(new Error("Aborted"));
    });
  });
}

function waitForInternalNow() {
  return +new Date();
}
