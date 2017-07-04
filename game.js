let WIDTH = 640;
let HEIGHT = 480;
let FPS = 60;
let MAX_SPIN = 0.5;
let GRAVITY = 0.2;
let WALL_FRICTION = 20;
let X_BOUNCE = 1;
let Y_BOUNCE = 0.8;
let ACCEL = 0.03;

let ctx = document.getElementById("gameCanvas").getContext("2d");

const Key = {
      _pressed: {},

      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,

      isDown: function (keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: (event) => {
        if (event.keyCode == Key.SPACE) {
          this.sudoku();
        }
        Key._pressed[event.keyCode] = true;
      },

      onKeyup: function (event) {
        delete this._pressed[event.keyCode];
      }
    };
    window.addEventListener('keyup', function (event) {
      Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function (event) {
      Key.onKeydown(event);
}, false);

function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

function Box(x, y) {
    this.pos = new Vector2(x, y);
    this.size = new Vector2(32, 32);
    this.v = new Vector2(0, 0);
    this.r = 0; // rotation
    this.rv = 0; // rotational v
}

let player = new Box(WIDTH / 2, HEIGHT / 2);

let update = () => {
    if (Key.isDown(Key.LEFT)) {
        player.rv -= ACCEL;
    }
    else if (Key.isDown(Key.RIGHT)) {
        player.rv += ACCEL;
    }
    else {
        player.rv *= 0.9;
    }
    if (Math.abs(player.rv) > MAX_SPIN) {
        player.rv = MAX_SPIN * Math.sign(player.rv);
    }
    player.r += player.rv;

    player.pos.x += player.v.x;
    player.pos.y += player.v.y;
    player.v.y += GRAVITY;

    if (player.pos.x > WIDTH - player.size.x) {
        player.pos.x = WIDTH - player.size.x;
        player.v.x *= -X_BOUNCE;
        player.v.y = -player.rv * WALL_FRICTION;
    }
    if (player.pos.x < 0) {
        player.pos.x = 0;
        player.v.x *= -X_BOUNCE;
        player.v.y = player.rv * WALL_FRICTION;
    }
    if (player.pos.y > HEIGHT - player.size.y) {
        player.pos.y = HEIGHT - player.size.y;
        player.v.y *= -Y_BOUNCE;
        player.v.x = player.rv * WALL_FRICTION;
    }
    if (player.pos.y < 0) {
        player.pos.y = 0;
        player.v.y *= -Y_BOUNCE;
        player.v.x = -player.rv * WALL_FRICTION;
    }
}

let draw = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "black";
    ctx.translate(player.pos.x + player.size.x / 2, player.pos.y + player.size.y / 2);
    ctx.rotate(player.r);
    ctx.fillRect(-player.size.x / 2, -player.size.y / 2, player.size.x, player.size.y);
    ctx.resetTransform();
}

let loop = () => {
    update();
    draw();
}

setInterval(loop, 1000 / FPS);