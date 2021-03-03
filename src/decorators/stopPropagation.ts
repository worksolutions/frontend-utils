export function stopPropagation<EVENT extends Event>(callback?: (event: EVENT) => void) {
  return function (event: EVENT) {
    event.stopPropagation();
    if (callback) callback(event);
    return event;
  };
}

export const stopPropagationHandler = stopPropagation();
