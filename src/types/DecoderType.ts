import Decoder from "jsonous/Decoder";

export type DecoderType<T extends Decoder<any>> = ReturnType<ReturnType<T["decodeAny"]>["getOrElseValue"]>;

export type NullableType<T> = T | null;