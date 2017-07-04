import { Constants } from "./constants";
import { Key } from "./key";
import { Player } from "./player";

class Game {
    player: Player;
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.player = new Player(Constants.WIDTH / 2, Constants.HEIGHT / 2,
            Constants.PLAYER_W, Constants.PLAYER_H);
        this.ctx = (document.getElementById("gameCanvas") as HTMLCanvasElement)
            .getContext("2d")!;

        setInterval(this.loop, 1000 / Constants.FPS);
    }

    private update = () => {
        if (Key.isDown(Key.LEFT)) {
            this.player.rv -= Constants.ACCEL;
        }
        else if (Key.isDown(Key.RIGHT)) {
            this.player.rv += Constants.ACCEL;
        }
        else {
            this.player.rv *= 0.9;
        }
        if (Math.abs(this.player.rv) > Constants.MAX_SPIN) {
            this.player.rv = Constants.MAX_SPIN * Math.sign(this.player.rv);
        }
        this.player.r += this.player.rv;

        this.player.x += this.player.dx;
        this.player.y += this.player.dy;
        this.player.dy += Constants.GRAVITY;

        if (this.player.x > Constants.WIDTH - this.player.w) {
            this.player.x = Constants.WIDTH - this.player.w;
            this.player.dx *= -Constants.X_BOUNCE;
            this.player.dy = -this.player.rv * Constants.WALL_FRICTION;
        }
        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.dx *= -Constants.X_BOUNCE;
            this.player.dy = this.player.rv * Constants.WALL_FRICTION;
        }
        if (this.player.y > Constants.HEIGHT - this.player.h) {
            this.player.y = Constants.HEIGHT - this.player.h;
            this.player.dy *= -Constants.Y_BOUNCE;
            this.player.dx = this.player.rv * Constants.WALL_FRICTION;
        }
        if (this.player.y < 0) {
            this.player.y = 0;
            this.player.dy *= -Constants.Y_BOUNCE;
            this.player.dx = -this.player.rv * Constants.WALL_FRICTION;
        }
    }

    private draw = () => {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);

        this.ctx.fillStyle = "black";
        this.ctx.translate(this.player.x + this.player.w / 2,
            this.player.y + this.player.h / 2);
        this.ctx.rotate(this.player.r);
        this.ctx.fillRect(-this.player.w / 2, -this.player.h / 2,
            this.player.w, this.player.h);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    private loop = () => {
        this.update();
        this.draw();
    }
}

var game = new Game();
console.log(game);