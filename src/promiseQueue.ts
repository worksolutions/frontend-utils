export type PromiseQueueContextWrapper = <T>(fn: () => Promise<T>) => () => Promise<T>;

export function promiseQueue(parallelCount: number, wrapTask?: PromiseQueueContextWrapper) {
  const activeTasks = new Set<Promise<any>>();
  const inactiveRuns: Array<() => void> = [];

  const wrap: PromiseQueueContextWrapper = wrapTask ?? ((task) => task);

  function runNext() {
    if (activeTasks.size >= parallelCount) return;
    const next = inactiveRuns.shift();
    if (next) next();
  }

  function addToQueue<T>(taskMaker: () => Promise<T>): Promise<T> {
    const wrappedTask = wrap(taskMaker);

    return new Promise<T>((resolve, reject) => {
      const run = () => {
        const task = wrappedTask()
          .then(resolve, reject)
          .finally(() => {
            activeTasks.delete(task);
            runNext();
          });

        activeTasks.add(task);
      };

      activeTasks.size < parallelCount ? run() : inactiveRuns.push(run);
    });
  }

  return addToQueue;
}

export type AddToQueueFunction = ReturnType<typeof promiseQueue>;
