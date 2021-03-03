export function eventValue<EVENT extends Event>(callback: (targetValue: string) => void) {
  return function (event: EVENT & { target: HTMLElement & { value: string } }) {
    callback(event.target.value);
    return event;
  };
}
