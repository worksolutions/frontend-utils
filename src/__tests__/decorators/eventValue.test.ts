import { stopPropagation } from "../../decorators/stopPropagation";

test("stop propagation test", function () {
  const myEvent = { stopPropagation: jest.fn() } as any as Event;
  const optionalCallback = jest.fn();

  stopPropagation(optionalCallback)(myEvent);

  expect(myEvent.stopPropagation).toHaveBeenCalled();
  expect(optionalCallback).toHaveBeenCalled();
});
