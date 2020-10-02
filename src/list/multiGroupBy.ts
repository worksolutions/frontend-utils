import { curry } from "ramda";

type FormattedObjectType<T> = { [key: string]: T[] };

export const multiGroupBy = curry(function <T>(
  getGroupKeys: (el: T) => (string | number)[],
  list: T[],
): FormattedObjectType<T> {
  return [...list].reduce<FormattedObjectType<T>>((acc, el) => {
    const groupKeys = getGroupKeys(el);
    groupKeys.forEach((key) => {
      if (key) acc[key] = acc[key] ? [...acc[key], el] : [el];
    });
    return acc;
  }, {});
});
