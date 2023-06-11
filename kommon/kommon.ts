export function fromCount<T>(n: number, callback: (index: number) => T): T[] {
    let result = Array(n);
    for (let k = 0; k < n; k++) {
        result[k] = callback(k);
    }
    return result;
}

export function fromRange<T>(lo: number, hi: number, callback: (index: number) => T): T[] {
    let count = hi - lo;
    let result = Array(count);
    for (let k = 0; k < count; k++) {
        result[k] = callback(k + lo);
    }
    return result;
}
