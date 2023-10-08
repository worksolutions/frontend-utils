import { promiseQueue } from "./promiseQueue";
import { range } from "./range";

export async function groupPromiseQueue(
  parallelCount: number,
  promisesCount: number,
  taskMaker: (index: number) => Promise<any>,
) {
  const addTask = promiseQueue(parallelCount);
  const groupsCount = Math.ceil(promisesCount / parallelCount);
  const promisesToWaitEnding = new Set<Promise<any>>();

  for (let group = 0; group < groupsCount; group++) {
    const groupFirstIndex = group * parallelCount;
    const promises = range(groupFirstIndex, Math.min(groupFirstIndex + parallelCount, promisesCount)).map((index) =>
      addTask(() => taskMaker(index)),
    );
    await Promise.race(
      promises.map((promise) => {
        const newPromise = promise.then((value) => {
          promisesToWaitEnding.delete(promise);
          return value;
        });
        promisesToWaitEnding.add(newPromise);
        return newPromise;
      }),
    );
  }

  await Promise.all(promisesToWaitEnding);
}
