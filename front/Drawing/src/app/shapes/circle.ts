import { shape } from "../shape";

export class circle extends shape {
    name: string = 'circle';
    radius: number;

    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, radius: number) {
        super(startx, starty, color, linewidth, fill);
        this.radius = radius;
    }

    mouse_is_in_shape(x: number, y: number): boolean {
        if ((Math.pow(x - this.start_x, 2) + Math.pow(y - this.start_y, 2)) < Math.pow(this.radius, 2)) {
            return true;
        } else {
            return false;
        }
    }
    draw_shape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.LineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.start_x, this.start_y, this.radius, 0, 2 * Math.PI);
        this.fill ? ctx.fill() : ctx.stroke();
        ctx.closePath();
    }
    resize(x: number): void {
        this.radius = this.radius * x;
    }
    clone(): shape {
        return new circle(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.radius);
    }
}