export const customNot = function (cb: (el?: any) => any) {
  return function (data: any): boolean {
    return !cb(data);
  };
};
