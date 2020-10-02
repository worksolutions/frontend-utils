export default (func?: Function) => {
  return function (ev?: any) {
    if (ev) {
      ev.preventDefault();
    }
    func && func(ev);
  };
};
