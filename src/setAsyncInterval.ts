export function setAsyncInterval<ARGS extends any[]>(
  callback: (...args: ARGS) => Promise<void> | void,
  time: number,
  ...args: ARGS
) {
  function generateTimer() {
    return setTimeout(async () => {
      await callback(...args);
      timerId = generateTimer();
    }, time);
  }

  let timerId = generateTimer();
  return () => clearTimeout(timerId);
}
