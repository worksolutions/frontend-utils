import { setAsyncInterval } from "./setAsyncInterval";

const err = new Error("waitFor stop");

type Options = { abortSignal?: AbortSignal; timeoutMS?: number; checkIntervalMS?: number };

export function waitFor(
  condition: () => boolean | Promise<boolean>,
  { abortSignal, timeoutMS = Infinity, checkIntervalMS = 100 }: Options = {},
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (abortSignal?.aborted) return reject(err);
    try {
      if (await condition()) return resolve();
    } catch (e) {
      return reject(e);
    }

    const startTime = Date.now();
    const stopTimer = setAsyncInterval(async () => {
      if (abortSignal?.aborted) return reject(err);

      try {
        if (await condition()) {
          stopTimer();
          resolve();
          return;
        }
      } catch (e) {
        return reject(e);
      }

      if (Date.now() - startTime > timeoutMS) {
        stopTimer();
        reject(err);
      }
    }, checkIntervalMS);

    abortSignal?.addEventListener("abort", stopTimer);
  });
}
