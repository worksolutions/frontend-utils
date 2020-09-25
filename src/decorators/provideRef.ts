import { isFunction } from "../is";

export function provideRef(...to: ({ current: any } | ((ref: any) => void) | null)[]) {
  return function (ref: any) {
    to.forEach((toElement) => {
      if (!toElement) return;
      if (isFunction(toElement)) {
        toElement(ref);
        return;
      }
      toElement.current = ref;
    });
  };
}
