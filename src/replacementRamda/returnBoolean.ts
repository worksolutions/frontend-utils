export const returnBoolean = function (cb: (el?: any) => any) {
  return function (data: any): boolean {
    return !!cb(data);
  };
};
