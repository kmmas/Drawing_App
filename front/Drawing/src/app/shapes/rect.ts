import { shape } from "../shape";

export class rect extends shape {
    name: string = 'rect';
    width: number;
    length: number;

    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, width: number, length: number) {
        super(startx, starty, color, linewidth, fill);
        this.width = width;
        this.length = length;
    }
    mouse_is_in_shape(x: number, y: number): boolean {
        return x < Math.max(this.start_x, this.start_x + this.width) && x > Math.min(this.start_x, this.start_x + this.width) && y < Math.max(this.start_y, this.start_y + this.length) && y > Math.min(this.start_y, this.start_y + this.length);
    }
    draw_shape(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.LineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        if (this.fill) {
            ctx.fillRect(this.start_x, this.start_y, this.width, this.length);
        } else {
            ctx.strokeRect(this.start_x, this.start_y, this.width, this.length);
        }
    }
    resize(x: number): void {
        this.width = this.width * x;
        this.length = this.length * x;
    }
    clone(): shape {
        return new rect(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.width, this.length);
    }

}