import { Constants } from "./constants";
import { Block } from "./block";
import { Camera } from "./camera";
import { Game } from "./game";

export class Level {
  public blocks: Array<Block>;

  private addBlock(x: number, y: number) {
    this.blocks.push(
      new Block(
        x * Constants.TILESIZE,
        y * Constants.TILESIZE,
        Constants.TILESIZE,
        Constants.TILESIZE
      )
    );
  }

  private movePlayer(game: Game, x: number, y: number) {
    game.player.x = x * Constants.TILESIZE;
    game.player.y = y * Constants.TILESIZE;
  }

  constructor(game: Game) {
    this.blocks = new Array();

    let levelImage = new Image();
    levelImage.src = "res/level.png";
    levelImage.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = levelImage.width;
      canvas.height = levelImage.height;
      let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.drawImage(levelImage, 0, 0, levelImage.width, levelImage.height);
      let data = ctx.getImageData(0, 0, levelImage.width, levelImage.height).data;

      Constants.LEVEL_W = levelImage.width * Constants.TILESIZE;
      Constants.LEVEL_H = levelImage.height * Constants.TILESIZE;

      for (let y = 0; y < levelImage.height; y++) {
        for (let x = 0; x < levelImage.width; x++) {
          let r = data[(x + y * levelImage.width) * 4];
          let g = data[(x + y * levelImage.width) * 4 + 1];
          let b = data[(x + y * levelImage.width) * 4 + 2];

          if (r === 0 && g === 0 && b === 0) {
            this.addBlock(x, y);
          }
          if (r === 255 && g === 255 && b === 0) {
            this.movePlayer(game, x, y);
          }
        }
      }
    };
  }

  private onScreen(block: Block): boolean {
    if (block.x - Camera.x > Constants.WIDTH) return false;
    if (block.x - Camera.x < -block.w) return false;
    if (block.y - Camera.y > Constants.HEIGHT) return false;
    if (block.y - Camera.y < -block.h) return false;
    return true;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const block of this.blocks) {
      if (this.onScreen(block)) block.draw(ctx);
    }
  }
}
