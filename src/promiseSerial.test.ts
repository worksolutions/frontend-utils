import { promiseSerial } from "./promiseSerial";
import { asyncTimeout } from "./asyncTimeout";

test("promise serial calling", function (done) {
  promiseSerial([() => asyncTimeout(200).then(() => "a"), () => asyncTimeout(100).then(() => "b"), () => "c"]).then(
    (promiseSerialResults) => {
      expect(promiseSerialResults).toStrictEqual(["a", "b", "c"]);
      done();
    },
  );
});
