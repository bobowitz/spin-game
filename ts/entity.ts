export class Entity {
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  dx = 0;
  dy = 0;

  get c_x() {
    return this.x + this.w / 2;
  }
  get c_y() {
    return this.y + this.h / 2;
  }

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
