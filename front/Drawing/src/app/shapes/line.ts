import { shape } from "../shape";

export class line extends shape {
    name: string = 'line';
    end_x: number;
    end_y: number;
    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, endx: number, endy: number) {
        super(startx, starty, color, linewidth, fill);
        this.end_x = endx;
        this.end_y = endy;
    }
    calculate_slope(): number {
        return (this.start_y - this.end_y) / (this.start_x - this.end_x);
    }
    mouse_is_in_shape(x: number, y: number): boolean {
        let slop = this.calculate_slope();
        console.log(slop);
        if (slop === Infinity) {
            return y < Math.max(this.start_y, this.end_y) && y > Math.min(this.start_y, this.end_y) && Math.abs(x - this.start_x) < 10;
        }
        if (Math.round(slop) === 0) {
            return Math.abs((y - this.start_y) - (slop * (x - this.start_x))) < 10 + Math.abs(slop) * 10 && x - Math.abs(slop) < Math.max(this.start_x, this.end_x) && x + Math.abs(slop) > Math.min(this.start_x, this.end_x);
        }
        return Math.abs((y - this.start_y) - (slop * (x - this.start_x))) < 10 + Math.abs(slop) * 10 && x - Math.abs(slop) < Math.max(this.start_x, this.end_x) && x + Math.abs(slop) > Math.min(this.start_x, this.end_x) && y < Math.max(this.start_y, this.end_y) && y > Math.min(this.start_y, this.end_y);
    }
    draw_shape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.LineWidth;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.start_x, this.start_y);
        ctx.lineTo(this.end_x, this.end_y);
        ctx.stroke();
        ctx.closePath();
    }
    resize(x: number): void {
        this.end_x += (x - 1) * (this.end_x - this.start_x);
        this.end_y += (x - 1) * (this.end_y - this.start_y);
    }
    clone(): shape {
        return new line(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.end_x, this.end_y);
    }
    override Move_shape(from_x: number, from_y: number, to_x: number, to_y: number): void {
        this.start_x += to_x - from_x;
        this.start_y += to_y - from_y;
        this.end_x += to_x - from_x;
        this.end_y += to_y - from_y;
    }

}