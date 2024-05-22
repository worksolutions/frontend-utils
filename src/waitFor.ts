import { setAsyncInterval } from "./setAsyncInterval";

type Stoppable = Promise<void> & { stop: () => void };

export function waitFor(condition: () => boolean | Promise<boolean>, timeoutMS: number, checkIntervalMS = 100) {
  let stoppedBeforeTickPassed = false;
  // eslint-disable-next-line no-async-promise-executor
  const promise = new Promise<void>(async (resolve, reject) => {
    try {
      if (await condition()) {
        resolve();
        return;
      }
    } catch (e) {
      reject(e);
      return;
    }

    const startTime = Date.now();
    const stopTimer = setAsyncInterval(async () => {
      try {
        if (await condition()) {
          stopTimer();
          resolve();
          return;
        }
      } catch (e) {
        reject(e);
        return;
      }

      if (Date.now() - startTime > timeoutMS) {
        stopTimer();
        reject(new Error("waitFor timeout"));
      }
    }, checkIntervalMS);

    promise.stop = function () {
      stopTimer();
      reject(new Error("waitFor stop"));
    };

    if (stoppedBeforeTickPassed) promise.stop();
  }) as Stoppable;

  promise.stop = function () {
    stoppedBeforeTickPassed = true;
  };

  return promise;
}
