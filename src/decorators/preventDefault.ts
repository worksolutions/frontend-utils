import { stopPropagation } from "./stopPropagation";

export function preventDefault<EVENT extends Event>(callback?: (event: EVENT) => void) {
  return function (event: EVENT) {
    event.preventDefault();
    if (callback) callback(event);
    return event;
  };
}

export const preventDefaultHandler = preventDefault();

export const preventDefaultAndStopPropagationHandler = stopPropagation(preventDefaultHandler);
