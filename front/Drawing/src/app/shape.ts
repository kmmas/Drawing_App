
export abstract class shape {
    private _start_x: number;
    private _start_y: number;
    private _color: string;
    private _LineWidth: number;
    private _fill: boolean;

    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean) {
        this._start_x = startx;
        this._start_y = starty;
        this._color = color;
        this._LineWidth = linewidth;
        this._fill = fill;
    }

    public get start_x(): number {
        return this._start_x;
    }
    public set start_x(value: number) {
        this._start_x = value;
    }
    public get start_y(): number {
        return this._start_y;
    }
    public set start_y(value: number) {
        this._start_y = value;
    }
    public get color(): string {
        return this._color;
    }
    public set color(value: string) {
        this._color = value;
    }
    public get LineWidth(): number {
        return this._LineWidth;
    }
    public set LineWidth(value: number) {
        this._LineWidth = value;
    }
    public get fill(): boolean {
        return this._fill;
    }
    public set fill(value: boolean) {
        this._fill = value;
    }

    abstract mouse_is_in_shape(x: number, y: number): boolean;
    abstract draw_shape(ctx: CanvasRenderingContext2D): void;
    abstract clone(): shape;
    abstract resize(x: number): void;
    Move_shape(from_x: number, from_y: number, to_x: number, to_y: number): void {
        this.start_x += to_x - from_x;
        this.start_y += to_y - from_y;
    }
}