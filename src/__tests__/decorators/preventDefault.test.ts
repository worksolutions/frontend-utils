import { preventDefault } from "../../decorators/preventDefault";

test("prevent default test", function () {
  const myEvent = { preventDefault: jest.fn() } as any as Event;
  const optionalCallback = jest.fn();

  preventDefault(optionalCallback)(myEvent);

  expect(myEvent.preventDefault).toHaveBeenCalled();
  expect(optionalCallback).toHaveBeenCalled();
});
