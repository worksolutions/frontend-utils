import { Moment, unitOfTime } from "moment";
import { sort, uniqWith } from "ramda";

export const sortDates = (dates: Moment[]): Moment[] => sort((a: Moment, b: Moment) => a.diff(b), dates);

export const uniqDatesBy = (by?: unitOfTime.StartOf) => (dates: Moment[]): Moment[] =>
  uniqWith((prevDate, currDate) => prevDate.isSame(currDate, by), dates);
