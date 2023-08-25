import { convertBytesToHumanReadableFormat } from "../bytesToHumanReadableFormat";

test("convert bytes", function () {
  const units = ["b", "kb", "mb"];
  expect(convertBytesToHumanReadableFormat(0, units)).toEqual("0 b");
  expect(convertBytesToHumanReadableFormat(1, units)).toEqual("1 b");
  expect(convertBytesToHumanReadableFormat(1023, units)).toEqual("1023 b");
  expect(convertBytesToHumanReadableFormat(1024, units)).toEqual("1.0 kb");
  expect(convertBytesToHumanReadableFormat(1025, units)).toEqual("1.0 kb");
  expect(convertBytesToHumanReadableFormat(1048575, units)).toEqual("1024.0 kb");
  expect(convertBytesToHumanReadableFormat(1048576, units)).toEqual("1.0 mb");
  expect(convertBytesToHumanReadableFormat(1048576 * 1.5, units)).toEqual("1.5 mb");
});
