export function promisifyAPI<T>(
  api: () => Promise<T>,
  states: {
    stateStart?: () => any;
    stateSuccess?: (data: T) => any;
    stateError?: (data: any) => any;
  },
  emitReject = false,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (states.stateStart) states.stateStart();
    api().then(
      (data) => {
        if (states.stateSuccess) states.stateSuccess(data);
        resolve(data);
      },
      (error) => {
        if (states.stateError) states.stateError(error);
        if (emitReject) reject(error);
      },
    );
  });
}
