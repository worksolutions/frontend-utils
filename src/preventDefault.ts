export function preventDefault(func?: Function | null) {
  return function (ev?: any) {
    if (ev) {
      ev.preventDefault();
    }
    func && func(ev);
  };
}
