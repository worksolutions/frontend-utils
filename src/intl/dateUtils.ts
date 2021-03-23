import { DateTime, DurationUnit } from "luxon";
import { cleanDateByPrecision } from "./dateCleaner";

type CompareDatesConfig = {
  value: DateTime;
  comparisonWith: DateTime;
};

export function isDateBefore({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  if (comparisonBy) {
    const cleanedValue = cleanDateByPrecision(comparisonBy, value);
    const cleanedComparisonWith = cleanDateByPrecision(comparisonBy, comparisonWith);
    return cleanedValue.diff(cleanedComparisonWith, comparisonBy).as(comparisonBy) <= -1;
  }

  return value.diff(comparisonWith).toMillis() < 0;
}

export function isDateAfter({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  if (comparisonBy) {
    const cleanedValue = cleanDateByPrecision(comparisonBy, value);
    const cleanedComparisonWith = cleanDateByPrecision(comparisonBy, comparisonWith);
    return cleanedValue.diff(cleanedComparisonWith, comparisonBy).as(comparisonBy) >= 1;
  }

  return value.diff(comparisonWith).toMillis() > 0;
}

export function isDateSame({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  if (comparisonBy) {
    const cleanedValue = cleanDateByPrecision(comparisonBy, value);
    const cleanedComparisonWith = cleanDateByPrecision(comparisonBy, comparisonWith);
    const comparisonValue = cleanedValue.diff(cleanedComparisonWith, comparisonBy).as(comparisonBy);
    return comparisonValue > -1 && comparisonValue < 1;
  }

  return value.diff(comparisonWith).toMillis() === 0;
}
