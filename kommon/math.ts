// Use objects instead of arrays: https://jsben.ch/FgKVi

export class Vec2 {
    constructor(
        public x: number = 0.0,
        public y: number = 0.0,
    ) {}

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
        return out
    }
}
