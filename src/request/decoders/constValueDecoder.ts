import Decoder from "jsonous";
import { ok } from "resulty";

export const constValueDecoder = <T = any>(value: any) => new Decoder<T>(() => ok(value));