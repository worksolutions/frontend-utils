import Decoder, { string, succeed } from "jsonous";
import { isString } from "../../is";
import { fieldWithDefaultDecoder } from "./fieldWithDefaultDecoder";
import { NullableType } from "../..";

export function codeTitleFieldDecoder(
  code: string | Decoder<NullableType<string>>,
  title: string | Decoder<NullableType<string>>,
) {
  return succeed({})
    .assign("code", isString(code) ? fieldWithDefaultDecoder(code, string, "") : code)
    .assign("title", isString(title) ? fieldWithDefaultDecoder(title, string, "") : title);
}
