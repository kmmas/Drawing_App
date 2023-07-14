import { shape } from "./shape";
import { circle } from './shapes/circle';
import { ellipse } from './shapes/ellipse';
import { line } from './shapes/line';
import { rect } from './shapes/rect';
import { square } from "./shapes/square";
import { triangle } from './shapes/triangle';

export class ShapeFactory {
    CreateShape(name: string, startx: number, starty: number, endx: number, endy: number, color: string, linewidth: number, fill: boolean): shape | null {
        switch (name) {
            case 'rect':
                let width = endx - startx;
                let length = endy - starty;
                return new rect(startx, starty, color, linewidth, fill, width, length);
            case 'ellipse':
                let major_axis = Math.abs(startx - endx);
                let minor_axis = Math.abs(starty - endy);
                return new ellipse(startx, starty, color, linewidth, fill, major_axis, minor_axis);
            case 'line':
                return new line(startx, starty, color, linewidth, fill, endx, endy);
            case 'circle':
                let radius = Math.sqrt(Math.pow(startx - endx, 2) + Math.pow(starty - endy, 2))
                return new circle(startx, starty, color, linewidth, fill, radius);
            case 'triangle':
                return new triangle(startx, starty, color, linewidth, fill, endx, endy);
            case 'square':
                let side1 = endx - startx;
                let side2 = Math.sign(endy - starty) * Math.abs(side1);
                return new square(startx, starty, color, linewidth, fill, side1, side2);
            default:
                return null;
        }
    }
}