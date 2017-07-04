define("constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Constants {
    }
    Constants.WIDTH = 640;
    Constants.HEIGHT = 480;
    Constants.FPS = 60;
    Constants.MAX_SPIN = 0.5;
    Constants.GRAVITY = 0.2;
    Constants.WALL_FRICTION = 20;
    Constants.X_BOUNCE = 1;
    Constants.Y_BOUNCE = 0.8;
    Constants.ACCEL = 0.04;
    Constants.PLAYER_W = 32;
    Constants.PLAYER_H = 32;
    Constants.HEALTH = 100;
    Constants.NUM_PLAYERS = 2;
    exports.Constants = Constants;
});
define("entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Entity {
        constructor(x, y, w, h) {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.dx = 0;
            this.dy = 0;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        get c_x() {
            return this.x + this.w / 2;
        }
        get c_y() {
            return this.y + this.h / 2;
        }
    }
    exports.Entity = Entity;
});
define("key", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Key {
        static init() {
            window.addEventListener('keyup', event => {
                this.onKeyUp(event);
            }, false);
            window.addEventListener('keydown', event => {
                this.onKeyDown(event);
            }, false);
        }
        static isDown(keyCode) {
            return this._pressed[keyCode];
        }
        static onKeyDown(event) {
            this._pressed[event.keyCode] = true;
        }
        static onKeyUp(event) {
            delete this._pressed[event.keyCode];
        }
    }
    Key._pressed = {};
    Key.SPACE = 32;
    Key.LEFT = 37;
    Key.UP = 38;
    Key.RIGHT = 39;
    Key.DOWN = 40;
    Key.W = 87;
    Key.A = 65;
    Key.S = 83;
    Key.D = 68;
    exports.Key = Key;
});
define("player", ["require", "exports", "entity"], function (require, exports, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player extends entity_1.Entity {
        constructor(x, y, w, h, health) {
            super(x, y, w, h);
            this.r = 0; // rotation
            this.rv = 0; // rotational velocity
            this.health = 0;
            this.health = health;
        }
    }
    exports.Player = Player;
});
define("game", ["require", "exports", "constants", "key", "player"], function (require, exports, constants_1, key_1, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        constructor() {
            this.update = () => {
                if (key_1.Key.isDown(key_1.Key.LEFT)) {
                    this.players[0].rv -= constants_1.Constants.ACCEL;
                }
                else if (key_1.Key.isDown(key_1.Key.RIGHT)) {
                    this.players[0].rv += constants_1.Constants.ACCEL;
                }
                else {
                    this.players[0].rv *= 0;
                }
                if (key_1.Key.isDown(key_1.Key.A)) {
                    this.players[1].rv -= constants_1.Constants.ACCEL;
                }
                else if (key_1.Key.isDown(key_1.Key.D)) {
                    this.players[1].rv += constants_1.Constants.ACCEL;
                }
                else {
                    this.players[1].rv *= 0;
                }
                for (const player of this.players) {
                    if (Math.abs(player.rv) > constants_1.Constants.MAX_SPIN) {
                        player.rv = constants_1.Constants.MAX_SPIN * Math.sign(player.rv);
                    }
                    player.r += player.rv;
                    player.x += player.dx;
                    player.y += player.dy;
                    player.dy += constants_1.Constants.GRAVITY;
                    if (player.x > constants_1.Constants.WIDTH - player.w) {
                        player.x = constants_1.Constants.WIDTH - player.w;
                        player.dx *= -constants_1.Constants.X_BOUNCE;
                        player.dy = -player.rv * constants_1.Constants.WALL_FRICTION;
                    }
                    if (player.x < 0) {
                        player.x = 0;
                        player.dx *= -constants_1.Constants.X_BOUNCE;
                        player.dy = player.rv * constants_1.Constants.WALL_FRICTION;
                    }
                    if (player.y > constants_1.Constants.HEIGHT - player.h) {
                        player.y = constants_1.Constants.HEIGHT - player.h;
                        player.dy *= -constants_1.Constants.Y_BOUNCE;
                        player.dx = player.rv * constants_1.Constants.WALL_FRICTION;
                    }
                    if (player.y < 0) {
                        player.y = 0;
                        player.dy *= -constants_1.Constants.Y_BOUNCE;
                        player.dx = -player.rv * constants_1.Constants.WALL_FRICTION;
                    }
                }
                if (Math.abs(this.players[0].c_x - this.players[1].c_x) < this.players[0].w &&
                    Math.abs(this.players[0].y - this.players[1].y) < this.players[0].h) {
                    if (this.players[0].y >= this.players[1].y) {
                        this.players[0].health -= 25;
                        this.players[0].dy = 10;
                        this.players[1].dy = -10;
                    }
                    else {
                        this.players[1].health -= 25;
                        this.players[1].dy = 10;
                        this.players[0].dy = -10;
                    }
                }
            };
            this.draw = () => {
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, constants_1.Constants.WIDTH, constants_1.Constants.HEIGHT);
                for (const player of this.players) {
                    this.ctx.fillStyle = `rgb(${Math.floor(255 - player.health * 2.5)}, ${Math.floor(player.health * 2.5)}, ${0})`;
                    this.ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
                    this.ctx.rotate(player.r);
                    this.ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
                    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            };
            this.loop = () => {
                this.update();
                this.draw();
                if (this.players[0].health <= 0) {
                    this.ctx.fillText('Player 2 wins!', 500, 250);
                    clearInterval(this.gameLoopId);
                }
                else if (this.players[1].health <= 0) {
                    this.ctx.fillText('Player 1 wins!', 500, 250);
                    clearInterval(this.gameLoopId);
                }
            };
            this.players = [];
            this.players.push(new player_1.Player(constants_1.Constants.WIDTH, constants_1.Constants.HEIGHT / 2, constants_1.Constants.PLAYER_W, constants_1.Constants.PLAYER_H, constants_1.Constants.HEALTH));
            this.players.push(new player_1.Player(0, constants_1.Constants.HEIGHT / 2, constants_1.Constants.PLAYER_W, constants_1.Constants.PLAYER_H, constants_1.Constants.HEALTH));
            this.ctx = document.getElementById('gameCanvas').getContext('2d');
            key_1.Key.init(); // set up keyboard input handler
            this.gameLoopId = setInterval(this.loop, 1000 / constants_1.Constants.FPS);
        }
    }
    var game = new Game();
    console.log(game);
});
//# sourceMappingURL=game.js.map