import { promiseQueue } from "./promiseQueue";
import { asyncTimeout } from "./asyncTimeout";

test("simple promise queue", function (done) {
  const addToQueue = promiseQueue(3);

  const results: number[] = [];

  function add(value: number) {
    return function () {
      results.push(value);
    };
  }

  addToQueue(() => asyncTimeout(100).then(add(1)));
  addToQueue(() => asyncTimeout(100).then(add(2)));
  addToQueue(() => asyncTimeout(100).then(add(3)));

  addToQueue(() => asyncTimeout(100).then(add(4)));
  addToQueue(() => asyncTimeout(200).then(add(5)));
  addToQueue(() => asyncTimeout(300).then(add(7)));

  addToQueue(() => asyncTimeout(100).then(add(6)));
  addToQueue(() => asyncTimeout(100).then(add(8)));
  addToQueue(() => asyncTimeout(100).then(add(9))).then(() => {
    expect(results).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    done();
  });
});
