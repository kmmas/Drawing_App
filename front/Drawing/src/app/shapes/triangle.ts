import { shape } from "../shape";

export class triangle extends shape {
    name: string = 'triangle';
    end_x: number;
    end_y: number;
    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, endx: number, endy: number) {
        super(startx, starty, color, linewidth, fill);
        this.end_x = endx;
        this.end_y = endy;
    }
    calculate_area(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }
    mouse_is_in_shape(x: number, y: number): boolean {
        let x1 = this.start_x;
        let y1 = this.start_y;
        let x2 = this.end_x;
        let y2 = this.end_y;
        let x3 = this.start_x * 2 - this.end_x;
        let y3 = this.end_y;
        let A = this.calculate_area(x1, y1, x2, y2, x3, y3);
        let A1 = this.calculate_area(x, y, x2, y2, x3, y3);
        let A2 = this.calculate_area(x1, y1, x, y, x3, y3);
        let A3 = this.calculate_area(x1, y1, x2, y2, x, y);
        return (A === (A1 + A2 + A3));
    }
    draw_shape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.LineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.start_x, this.start_y);
        ctx.lineTo(this.end_x, this.end_y);
        ctx.lineTo(this.start_x * 2 - this.end_x, this.end_y);
        ctx.closePath();
        this.fill ? ctx.fill() : ctx.stroke();
    }
    resize(x: number): void {
        let old_start_x = this.start_x;
        let old_start_y = this.start_y;
        this.start_x *= x;
        this.end_x *= x;
        this.start_y *= x;
        this.end_y *= x;
        this.Move_shape(this.start_x, this.start_y, old_start_x, old_start_y);
    }
    clone(): shape {
        return new triangle(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.end_x, this.end_y);
    }
    override Move_shape(from_x: number, from_y: number, to_x: number, to_y: number): void {
        this.start_x += to_x - from_x;
        this.start_y += to_y - from_y;
        this.end_x += to_x - from_x;
        this.end_y += to_y - from_y;
    }

}