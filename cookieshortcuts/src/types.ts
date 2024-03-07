export type TKeybind = {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    code?: string;
};

export type TShortcutPair = [TKeybind | null, number, (number | boolean | string)[]];

// thank you discord: @jhmaster
export type TImmutable<T> = {
    readonly [P in keyof T]: T[P];
};
export type TMutable<T> = {
    -readonly [P in keyof T]: T[P];
};

// thank you stack overflow: https://stackoverflow.com/questions/56863875/typescript-how-do-you-filter-a-types-properties-to-those-of-a-certain-type
export type ExtractKeysByValue<T extends object, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

// thank you stack overflow: https://stackoverflow.com/questions/49729550/implicitly-create-a-tuple-in-typescript
export const Tuple = <T extends any[]>(...args: T): T => args;
