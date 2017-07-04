import { Constants } from "./constants";
import { Key } from "./key";
import { Player } from "./player";
import { Block } from "./block";
import { Level } from "./level";
import { Camera } from "./camera";
import { Parallax } from "./parallax";

export class Game {
  player: Player;
  public level: Level;
  parallax: Parallax;
  public static spritesheet: HTMLImageElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.player = new Player(
      this,
      Constants.WIDTH / 2,
      Constants.HEIGHT / 2,
      Constants.PLAYER_W,
      Constants.PLAYER_H
    );
    this.ctx = (document.getElementById("gameCanvas") as HTMLCanvasElement).getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    Key.init(); // set up keyboard input handler

    Game.spritesheet = new Image();
    Game.spritesheet.src = "res/tileset.png";

    this.level = new Level();
    this.parallax = new Parallax();

    setInterval(this.loop, 1000 / Constants.FPS);
  }

  private update = () => {
    this.player.update();
    Camera.updateTarget(this.player);
    Camera.update();
  };

  private draw = () => {
    this.ctx.fillStyle = "#301a52";
    this.ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);

    this.parallax.draw(this.ctx);
    this.level.draw(this.ctx);
    this.player.draw(this.ctx);
  };

  private loop = () => {
    this.update();
    this.draw();
  };
}

var game = new Game();
