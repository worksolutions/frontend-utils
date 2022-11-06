export function waitFor(condition: () => boolean, timeoutMS: number, checkIntervalMS = 100): Promise<void> {
  return new Promise((resolve, reject) => {
    if (condition()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
        return;
      }

      if (Date.now() - startTime > timeoutMS) {
        clearInterval(interval);
        reject(new Error("waitFor timeout"));
      }
    }, checkIntervalMS);
  });
}
