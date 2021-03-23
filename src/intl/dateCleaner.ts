import { DateTime, DurationUnit } from "luxon";

const cleanMills = (value: DateTime) => value.set({ millisecond: 0 });
const cleanSec = (value: DateTime) => value.set({ second: 0 });
const cleanMin = (value: DateTime) => value.set({ minute: 0 });
const cleanHours = (value: DateTime) => value.set({ hour: 0 });
const cleanDays = (value: DateTime) => value.set({ day: 1 });
const cleanMonth = (value: DateTime) => value.set({ month: 1 });

const secondsCleaner = [cleanMills];
const minutesCleaner = [...secondsCleaner, cleanSec];
const hoursCleaner = [...minutesCleaner, cleanMin];
const daysCleaner = [...hoursCleaner, cleanHours];
const monthsCleaner = [...daysCleaner, cleanDays];
const yearsCleaner = [...monthsCleaner, cleanMonth];

const cleaners: Record<string, ((value: DateTime) => DateTime)[]> = {
  second: secondsCleaner,
  seconds: secondsCleaner,
  minute: minutesCleaner,
  minutes: minutesCleaner,
  hour: hoursCleaner,
  hours: hoursCleaner,
  day: daysCleaner,
  days: daysCleaner,
  month: monthsCleaner,
  months: monthsCleaner,
  year: yearsCleaner,
  years: monthsCleaner,
};

export function cleanDateByPrecision(precision: DurationUnit, value: DateTime) {
  if (!cleaners[precision]) return value;
  return cleaners[precision].reduce((value, cleaner) => cleaner(value), value);
}
