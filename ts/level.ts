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

  private pointInRect(pX: number, pY: number, rX: number, rY: number, rW: number, rH: number) {
    if (pX >= rX + rW || pX < rX) return false;
    if (pY >= rY + rH || pY < rY) return false;
    return true;
  }

  private generate(game: Game) {
    const CORRIDOR_WIDTH = 16;
    const CORRIDOR_HEIGHT = 1000;

    Constants.LEVEL_W = Constants.WIDTH;
    Constants.LEVEL_H = CORRIDOR_HEIGHT * Constants.TILESIZE;

    game.player.x = Constants.LEVEL_W / 2 - game.player.w / 2;
    game.player.y = (CORRIDOR_HEIGHT - 5) * Constants.TILESIZE;

    for (let x = 0; x < Constants.WIDTH / Constants.TILESIZE; x++) {
      for (let y = 0; y < CORRIDOR_HEIGHT; y++) {
        if (
          this.pointInRect(
            x,
            y,
            Constants.LEVEL_W / Constants.TILESIZE / 2 - CORRIDOR_WIDTH / 2,
            0,
            CORRIDOR_WIDTH,
            CORRIDOR_HEIGHT - 1
          )
        ) {
          continue;
        } else {
          this.addBlock(x, y);
        }
      }
    }
  }

  constructor(game: Game) {
    this.blocks = new Array();

    this.generate(game);
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
