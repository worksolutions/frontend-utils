export default (func: Function) => {
  return function (ev?: any) {
    if (ev && ev.target) {
      func(ev.target.value);
      return;
    }

    func(null);
  };
};
