import { DateTime, DurationUnit } from "luxon";

type CompareDatesConfig = {
  value: DateTime;
  comparisonWith: DateTime;
};

export function isDateBefore({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  const comparison = value.diff(comparisonWith, comparisonBy);
  if (comparisonBy) {
    return comparison.as(comparisonBy) <= -1;
  }

  return comparison.toMillis() < 0;
}

export function isDateAfter({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  const comparison = value.diff(comparisonWith, comparisonBy);
  if (comparisonBy) {
    return comparison.as(comparisonBy) >= 1;
  }

  return comparison.toMillis() > 0;
}

// TODO: чистить даты если передан comparisonBy
// если comparisonBy === "hours" -> {...value, minutes: 0, seconds: 0, milliseconds: 0}
export function isDateSame({ comparisonWith, value }: CompareDatesConfig, comparisonBy?: DurationUnit) {
  const comparison = value.diff(comparisonWith, comparisonBy);
  if (comparisonBy) {
    const comparisonValue = comparison.as(comparisonBy);
    return comparisonValue > -1 && comparisonValue < 1;
  }

  return comparison.toMillis() === 0;
}
