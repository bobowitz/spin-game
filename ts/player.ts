import { Entity } from "./entity";

export class Player extends Entity {
    x = 0;
    y = 0;
    w = 0;
    h = 0;
    dx = 0;
    dy = 0;
    r = 0; // rotation
    rv = 0; // rotational velocity
}