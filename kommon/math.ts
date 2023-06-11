// Use objects instead of arrays: https://jsben.ch/FgKVi

export function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}

export function towards(cur: number, target: number, max_delta: number): number {
    if (cur > target) {
        return Math.max(cur - max_delta, target);
    } else if (cur < target) {
        return Math.min(cur + max_delta, target);
    } else {
        return target;
    }
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export class Vec2 {
    constructor(
        public x: number = 0.0,
        public y: number = 0.0,
    ) { }

    static zero = new Vec2(0, 0);
    static one = new Vec2(1, 1);

    static copy(v: Vec2, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = v.x;
        out.y = v.y;
        return out;
    }

    static add(a: Vec2, b: Vec2, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    static sub(a: Vec2, b: Vec2, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    static negate(v: Vec2, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = -v.x;
        out.y = -v.y;
        return out;
    }

    static scale(v: Vec2, s: number, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = v.x * s;
        out.y = v.y * s;
        return out;
    }

    static lerp(a: Vec2, b: Vec2, t: number, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = a.x * (1 - t) + b.x * t;
        out.y = a.y * (1 - t) + b.y * t;
        return out;
    }

    static isZero(v: Vec2): boolean {
        return v.x == 0 && v.y == 0;
    }

    static equals(a: Vec2, b: Vec2): boolean {
        return a.x == b.x && a.y == b.y;
    }

    static map2(a: Vec2, b: Vec2, fn: (a: number, b: number) => number, out?: Vec2): Vec2 {
        out = out || new Vec2();
        out.x = fn(a.x, b.x);
        out.y = fn(a.y, b.y);
        return out;
    }
}
