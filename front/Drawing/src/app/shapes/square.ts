import { shape } from "../shape";

export class square extends shape {
    name: string = 'square';
    side1: number;
    side2: number;
    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, side1: number, side2: number) {
        super(startx, starty, color, linewidth, fill);
        this.side1 = side1;
        this.side2 = side2;
    }
    mouse_is_in_shape(x: number, y: number): boolean {
        return x < Math.max(this.start_x, this.start_x + this.side1) && x > Math.min(this.start_x, this.start_x + this.side1) && y < Math.max(this.start_y, this.start_y + this.side2) && y > Math.min(this.start_y, this.start_y + this.side2);
    }
    draw_shape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.LineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.fill) {
            ctx.fillRect(this.start_x, this.start_y, this.side1, this.side2)
        } else {
            ctx.strokeRect(this.start_x, this.start_y, this.side1, this.side2);
        }
    }
    resize(x: number): void {
        this.side1 *= x;
        this.side2 *= x;
    }
    clone(): shape {
        return new square(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.side1, this.side2);
    }
}