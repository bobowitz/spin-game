import { Entity } from './entity';

export class Player extends Entity {
  r = 0; // rotation
  rv = 0; // rotational velocity
  health = 0;

  constructor(x: number, y: number, w: number, h: number, health: number) {
    super(x, y, w, h);
    this.health = health;
  }
}
