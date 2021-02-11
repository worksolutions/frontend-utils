export function preventDefault(func?: Function | null) {
  return function (ev?: any) {
    ev?.preventDefault();
    func && func(ev);
  };
}
