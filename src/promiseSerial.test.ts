import { promiseSerial } from "./promiseSerial";
import { asyncTimeout } from "./asyncTimeout";

test("promise serial calling", function (done) {
  const results: number[] = [];

  function add(value: number) {
    return function () {
      results.push(value);
    };
  }

  promiseSerial([() => asyncTimeout(200).then(add(200)), () => asyncTimeout(100).then(add(100))]).then(() => {
    expect(results).toStrictEqual([200, 100]);
    done();
  });
});
