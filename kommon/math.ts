// Use objects instead of arrays: https://jsben.ch/FgKVi

export class Vec2 {
    constructor(
        public x: number = 0.0,
        public y: number = 0.0,
    ) { }

    static zero = new Vec2(0, 0);

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
