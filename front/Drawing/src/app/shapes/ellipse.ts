import { shape } from "../shape";

export class ellipse extends shape {
    name: string = 'ellipse';
    major_axis: number;
    minor_axis: number;
    constructor(startx: number, starty: number, color: string, linewidth: number, fill: boolean, major: number, minor: number) {
        super(startx, starty, color, linewidth, fill);
        this.major_axis = major;
        this.minor_axis = minor;
    }
    mouse_is_in_shape(x: number, y: number): boolean {
        if (((Math.pow(x - this.start_x, 2) / Math.pow(this.major_axis, 2)) + Math.pow(y - this.start_y, 2) / Math.pow(this.minor_axis, 2)) < 1) {
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
        ctx.ellipse(this.start_x, this.start_y, this.major_axis, this.minor_axis, 0, 0, 2 * Math.PI);
        this.fill ? ctx.fill() : ctx.stroke();
        ctx.closePath();
    }
    resize(x: number): void {
        this.major_axis *= x;
        this.minor_axis *= x;
    }
    clone(): shape {
        return new ellipse(this.start_x, this.start_y, this.color, this.LineWidth, this.fill, this.major_axis, this.minor_axis);
    }

}