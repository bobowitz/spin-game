import { Constants } from "./constants";
import { Game } from "./game";
import { Camera } from "./camera";

export class Parallax {
  tileW = Constants.TILESIZE * 2;
  tileH = Constants.TILESIZE * 2;

  public draw(ctx: CanvasRenderingContext2D) {
    let drawX = -(Camera.x / 2);
    let drawY = -(Camera.y / 2);

    while (drawX > 0) drawX -= this.tileW;
    while (drawX <= -this.tileW) drawX += this.tileW;
    while (drawX > 0) drawY -= this.tileH;
    while (drawX <= -this.tileH) drawY += this.tileH;

    for (let x = drawX; x < Constants.WIDTH + this.tileW * 2; x += this.tileW) {
      for (let y = drawY; y < Constants.HEIGHT + this.tileH * 2; y += this.tileH) {
        ctx.drawImage(
          Game.spritesheet,
          0,
          Constants.TILESIZE * 2,
          Constants.TILESIZE * 2,
          Constants.TILESIZE * 2,
          x,
          y,
          this.tileW,
          this.tileH
        );
      }
    }
  }
}
