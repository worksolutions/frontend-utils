import { identityValueDecoder, valueDecoder, orDefaultDecoder, fieldOrDefaultDecoder, enumDecoder } from "./decoders";
import { string } from "jsonous";

test("identity value decoder", function () {
  expect(identityValueDecoder.decodeAny(1).getOrElseValue(null)).toBe(1);
});

test("value decoder", function () {
  expect(valueDecoder(1).decodeAny(1).getOrElseValue(123)).toBe(1);
  expect(valueDecoder(1).decodeAny(2).getOrElseValue(123)).toBe(123);
  expect(valueDecoder(1).decodeAny(undefined).getOrElseValue(123)).toBe(123);
});

test("or default decoder", function () {
  expect(orDefaultDecoder(string, 5).decodeAny("hello").getOrElseValue(123)).toBe("hello");
  expect(orDefaultDecoder(string, 5).decodeAny(123123).getOrElseValue(123)).toBe(5);
});

test("field or default decoder", function () {
  expect(
    fieldOrDefaultDecoder("string-key", string, "default-value")
      .decodeAny({ "string-key": "real-value" })
      .getOrElseValue("unacceptable"),
  ).toBe("real-value");

  expect(
    fieldOrDefaultDecoder("string-key", string, "default-value")
      .decodeAny({ "unreal-string-key": "real-value" })
      .getOrElseValue("unacceptable"),
  ).toBe("default-value");
});

test("enum decoder", function () {
  enum Priorities {
    LOW = "LOW_VALUE",
    MEDIUM = "MEDIUM_VALUE",
    HIGH = "HIGH_VALUE",
  }

  const matches = {
    LOW: Priorities.LOW,
    MEDIUM: Priorities.MEDIUM,
    HIGH: Priorities.HIGH,
  };

  expect(enumDecoder(matches).decodeAny("LOW").getOrElseValue(null!)).toBe(Priorities.LOW);

  expect(enumDecoder(matches).decodeAny("unexpected").getOrElseValue(null!)).toBe(null);
});
