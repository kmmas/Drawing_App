import { shape } from "./shape";

export class operation {
    private _name: string;
    private _index: number;
    private _target: shape;

    constructor(name: string, index: number, target: shape) {
        this._name = name;
        this._index = index;
        this._target = target;
    }

    clone(): operation {
        return new operation(this.name, this.index, this.target.clone());
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get index(): number {
        return this._index;
    }
    public set index(value: number) {
        this._index = value;
    }
    public get target(): shape {
        return this._target;
    }
    public set target(value: shape) {
        this._target = value;
    }
}