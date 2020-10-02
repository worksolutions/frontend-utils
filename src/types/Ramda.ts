export type Flatten2 = <T>(arg: T[][]) => T[];
export type Flatten3 = <T>(arg: T[][][]) => T[];
export type Flatten4 = <T>(arg: T[][][][]) => T[];

export type FilterArray = <T>(func: (a: T) => boolean) => (b: T[]) => T[];
