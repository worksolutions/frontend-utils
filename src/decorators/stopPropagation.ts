export function stopPropagation(func?: Function) {
  return function (ev?: any) {
    ev?.stopPropagation();
    if (func) func(ev);
  };
}
