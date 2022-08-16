export function setAsyncInterval<ARGS extends any[]>(
  callback: (...args: ARGS) => Promise<void> | void,
  time: number,
  ...args: ARGS
) {
  function generateTimer() {
    return setTimeout(async () => {
      await callback(...args);
      if (timerId) timerId = generateTimer();
    }, time);
  }

  let timerId: NodeJS.Timeout | null = generateTimer();
  return () => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
  };
}
