import { field, maybe, string } from "jsonous";
import moment, { Moment } from "moment";
import { isNothing } from "maybeasy";

import { DateMode } from "../../date";

export function momentFieldDecoder(key: string, mode = DateMode.DATE, defaultValue?: Moment) {
  return maybe(field(key, string)).map((maybeValue) => {
    defaultValue = defaultValue || moment.invalid();
    if (isNothing(maybeValue)) return defaultValue;
    const value = maybeValue.getOrElseValue(null!);
    return !value.length ? defaultValue : moment(value, mode);
  });
}
