import { Constants } from './constants';
import { Key } from './key';
import { Player } from './player';

class Game {
  players: Player[];
  ctx: CanvasRenderingContext2D;
  gameLoopId: number;
  constructor() {
    this.players = [];
    this.players.push(
      new Player(
        Constants.WIDTH,
        Constants.HEIGHT / 2,
        Constants.PLAYER_W,
        Constants.PLAYER_H,
        Constants.HEALTH
      )
    );
    this.players.push(
      new Player(0, Constants.HEIGHT / 2, Constants.PLAYER_W, Constants.PLAYER_H, Constants.HEALTH)
    );
    this.ctx = (document.getElementById('gameCanvas') as HTMLCanvasElement).getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    Key.init(); // set up keyboard input handler

    this.gameLoopId = setInterval(this.loop, 1000 / Constants.FPS);
  }

  private update = () => {
    if (Key.isDown(Key.LEFT)) {
      this.players[0].rv -= Constants.ACCEL;
    } else if (Key.isDown(Key.RIGHT)) {
      this.players[0].rv += Constants.ACCEL;
    } else {
      this.players[0].rv *= 0;
    }
    if (Key.isDown(Key.A)) {
      this.players[1].rv -= Constants.ACCEL;
    } else if (Key.isDown(Key.D)) {
      this.players[1].rv += Constants.ACCEL;
    } else {
      this.players[1].rv *= 0;
    }
    for (const player of this.players) {
      if (Math.abs(player.rv) > Constants.MAX_SPIN) {
        player.rv = Constants.MAX_SPIN * Math.sign(player.rv);
      }
      player.r += player.rv;

      player.x += player.dx;
      player.y += player.dy;
      player.dy += Constants.GRAVITY;

      if (player.x > Constants.WIDTH - player.w) {
        player.x = Constants.WIDTH - player.w;
        player.dx *= -Constants.X_BOUNCE;
        player.dy = -player.rv * Constants.WALL_FRICTION;
      }
      if (player.x < 0) {
        player.x = 0;
        player.dx *= -Constants.X_BOUNCE;
        player.dy = player.rv * Constants.WALL_FRICTION;
      }
      if (player.y > Constants.HEIGHT - player.h) {
        player.y = Constants.HEIGHT - player.h;
        player.dy *= -Constants.Y_BOUNCE;
        player.dx = player.rv * Constants.WALL_FRICTION;
      }
      if (player.y < 0) {
        player.y = 0;
        player.dy *= -Constants.Y_BOUNCE;
        player.dx = -player.rv * Constants.WALL_FRICTION;
      }
    }
    if (
      Math.abs(this.players[0].c_x - this.players[1].c_x) < this.players[0].w &&
      Math.abs(this.players[0].y - this.players[1].y) < this.players[0].h
    ) {
      if (this.players[0].y >= this.players[1].y) {
        this.players[0].health -= 25;
        this.players[0].dy = 10;
        this.players[1].dy = -10;
      } else {
        this.players[1].health -= 25;
        this.players[1].dy = 10;
        this.players[0].dy = -10;
      }
    }
  };

  private draw = () => {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);

    for (const player of this.players) {
      this.ctx.fillStyle = `rgb(${Math.floor(255 - player.health * 2.5)}, ${Math.floor(
        player.health * 2.5
      )}, ${0})`;
      this.ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
      this.ctx.rotate(player.r);
      this.ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  private loop = () => {
    this.update();
    this.draw();
    if (this.players[0].health <= 0) {
      this.ctx.fillText('Player 2 wins!', 500, 250);
      clearInterval(this.gameLoopId);
    } else if (this.players[1].health <= 0) {
      this.ctx.fillText('Player 1 wins!', 500, 250);
      clearInterval(this.gameLoopId);
    }
  };
}

var game = new Game();
console.log(game);
