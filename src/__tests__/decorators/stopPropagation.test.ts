import { eventValue } from "../../decorators/eventValue";

test("stop propagation test", function () {
  const myEvent = { target: { value: "event value" } } as any as Event & { target: HTMLElement & { value: string } };

  eventValue((value) => expect(value).toBe("event value"))(myEvent);
});
