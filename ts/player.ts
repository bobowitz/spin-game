import { Entity } from "./entity";
import { Key } from "./key";
import { Constants } from "./constants";
import { Game } from "./game";
import { Block } from "./block";
import { Camera } from "./camera";

export class Player extends Entity {
  r = 0; // rotation
  rv = 0; // rotational velocity
  game: Game;

  constructor(game: Game, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.game = game;
  }

  private hitTop() {
    this.dy *= -Constants.Y_BOUNCE;
    this.dx += this.rv * Constants.WALL_FRICTION;
  }

  private hitBottom() {
    this.dy *= -Constants.Y_BOUNCE;
    this.dx += -this.rv * Constants.WALL_FRICTION;
  }

  private hitLeft() {
    this.dx *= -Constants.X_BOUNCE;
    this.dy += this.rv * Constants.WALL_FRICTION;
  }

  private hitRight() {
    this.dx *= -Constants.X_BOUNCE;
    this.dy += -this.rv * Constants.WALL_FRICTION;
  }

  private edgeCollisions() {
    if (this.x > Constants.WIDTH - this.w) {
      this.x = Constants.WIDTH - this.w;
      this.hitRight();
    }
    if (this.x < 0) {
      this.x = 0;
      this.hitLeft();
    }
    if (this.y > Constants.HEIGHT - this.h) {
      this.y = Constants.HEIGHT - this.h;
      this.hitTop();
    }
    if (this.y < 0) {
      this.y = 0;
      this.hitBottom();
    }
  }

  private colliding(block: Block): boolean {
    if (this.x >= block.x + block.w || this.x + this.w <= block.x) return false;
    if (this.y >= block.y + block.h || this.y + this.h <= block.y) return false;
    return true;
  }

  private handleXCollisions() {
    for (const block of this.game.level.blocks) {
      if (this.colliding(block)) {
        if (this.dx > 0) {
          this.x = block.x - this.w;
          this.hitRight();
        } else {
          this.x = block.x + block.w;
          this.hitLeft();
        }
      }
    }
  }

  private handleYCollisions() {
    for (const block of this.game.level.blocks) {
      if (this.colliding(block)) {
        if (this.dy > 0) {
          this.y = block.y - this.h;
          this.hitTop();
        } else {
          this.y = block.y + block.h;
          this.hitBottom();
        }
      }
    }
  }

  public update() {
    if (Key.isDown(Key.LEFT)) {
      this.rv -= Constants.ACCEL;
    } else if (Key.isDown(Key.RIGHT)) {
      this.rv += Constants.ACCEL;
    } else {
      this.rv *= 0.9;
    }
    if (Math.abs(this.rv) > Constants.MAX_SPIN) {
      this.rv = Constants.MAX_SPIN * Math.sign(this.rv);
    }
    this.r += this.rv;

    // edgeCollisions();

    this.x += this.dx;
    this.handleXCollisions();
    this.y += this.dy;
    this.handleYCollisions();

    this.dy += Constants.GRAVITY;

    this.dx = Math.sign(this.dx) * Math.min(Math.abs(this.dx), Constants.MAX_DX);
    this.dy = Math.sign(this.dy) * Math.min(Math.abs(this.dy), Constants.MAX_DY);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    let scaleFactor = Math.max(1, Math.abs(this.rv) * Constants.SPIN_SCALE_FACTOR);

    ctx.translate(this.x + this.w / 2 - Camera.x, this.y + this.h / 2 - Camera.y);
    ctx.rotate(this.r);
    ctx.drawImage(
      Game.spritesheet,
      Constants.TILESIZE * 3,
      0,
      Constants.TILESIZE * 2,
      Constants.TILESIZE * 2,
      -this.w / 2 * scaleFactor,
      -this.h / 2 * scaleFactor,
      this.w * scaleFactor,
      this.h * scaleFactor
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
