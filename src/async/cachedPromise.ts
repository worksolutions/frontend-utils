export function getPromiseCacheFunc(seconds = 10) {
  const storage = new Map<string, { expiredTime: number; promiseResult: Promise<any> }>();

  function getNowSeconds() {
    return new Date().getTime() / 1000;
  }

  function add(key: any, result: any) {
    storage.set(key, {
      promiseResult: result,
      expiredTime: getNowSeconds() + seconds,
    });
  }

  function isExpired(key: any) {
    const expiredTime = storage.get(key)?.expiredTime;
    return expiredTime && getNowSeconds() > expiredTime;
  }

  return function <T>(promise: () => Promise<T>, key: string): () => Promise<T> {
    if (!storage.has(key) || isExpired(key)) {
      return () =>
        promise().then((promiseResult) => {
          add(key, promiseResult);
          return promiseResult;
        });
    }
    const promiseResult = storage.get(key)?.promiseResult;
    return () => Promise.resolve(promiseResult);
  };
}
