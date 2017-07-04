import { Camera } from "./camera";
import { Constants } from "./constants";
import { Game } from "./game";

export class Block {
  x = 0;
  y = 0;
  w = 0;
  h = 0;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      Game.spritesheet,
      0,
      0,
      Constants.TILESIZE,
      Constants.TILESIZE,
      this.x - Camera.x,
      this.y - Camera.y,
      this.w,
      this.h
    );
  }
}
