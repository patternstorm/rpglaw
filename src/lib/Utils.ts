export function replacer(key: string, value: any): any {
    if (key[0] === "_") return undefined
    else return value
}

export function serialize<T>(x: T): string {
    return JSON.stringify(x, replacer)
}

export function isDefined<T>(argument: T | undefined): argument is T {
    return (argument !== undefined)
}

export const sum = (values: number[]) => {
    return values.reduce((acc, value) => acc + value, 0)
};

export function flatten<T>(list: T[][]): T[] {
    return list.reduce((flat, list) => flat.concat(list), [])
}

function zip(v1: number[], v2: number[]): [number, number][] {
    return v1.map((n, index) => [n, v2[index]])
}

export const dot = (v1: number[], v2: number[]) => {
    return sum(zip(v1, v2).map(x => x[0] * x[1]))
}

export function average(values: number[]): (number | undefined) {
    const n: number = values.length;
    if (n == 0) return undefined;
    else return (sum(values) / n);
}

export async function delay(ms: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function random(min: number, max:number): number {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
}

export function hash(str: string): number {
    var h: number = 0;
    for (var i = 0; i < str.length; i++) {
        h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xFFFFFFFF
}

export type Range<T extends number> = number extends T ? number :_Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R['length'] : R['length'] | _Range<T, [T, ...R]>;
