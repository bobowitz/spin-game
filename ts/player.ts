import { Entity } from "./entity";

export class Player extends Entity {
    r = 0; // rotation
    rv = 0; // rotational velocity

    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
    }
}