export function promiseQueue(parallelCount: number) {
  const activeTasks: Promise<any>[] = [];
  const inactiveTasksMakers: (() => Promise<any>)[] = [];

  function addToQueue<T>(taskMaker: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const makeTask = () => taskMaker().then(resolve, reject);

      if (activeTasks.length < parallelCount) {
        const task = makeTask();
        activeTasks.push(task);
        task.finally(() => {
          activeTasks.splice(activeTasks.indexOf(task), 1);
          runFirstInactiveTask();
        });
        return;
      }

      inactiveTasksMakers.push(makeTask);
    });
  }

  function runFirstInactiveTask() {
    const firstInactiveTask = inactiveTasksMakers.shift();
    if (!firstInactiveTask) return;
    addToQueue(firstInactiveTask);
  }

  return addToQueue;
}

export type AddToQueueFunction = ReturnType<typeof promiseQueue>;
