export function promiseQueue(parallelCount: number) {
  const activeTasks = new Set<Promise<any>>();

  return function addToQueue<T>(promiseMaker: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (activeTasks.size < parallelCount) {
        const task = promiseMaker().then(resolve, reject);
        activeTasks.add(task);
        task.finally(() => activeTasks.delete(task));
        return;
      }

      const [firstActiveTask] = [...activeTasks.values()];

      firstActiveTask.finally(() => addToQueue(promiseMaker).then(resolve, reject));
    });
  };
}
