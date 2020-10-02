export const customRamdaFilter = function <T>(cb: (el: T) => boolean) {
  return function (list: T[]) {
    return list.filter(cb);
  };
};
