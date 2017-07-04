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
    }
    exports.Entity = Entity;
});
define("key", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Key {
        static init() {
            window.addEventListener('keyup', (event) => {
                this.onKeyUp(event);
            }, false);
            window.addEventListener('keydown', (event) => {
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
    exports.Key = Key;
});
define("player", ["require", "exports", "entity"], function (require, exports, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player extends entity_1.Entity {
        constructor(x, y, w, h) {
            super(x, y, w, h);
            this.r = 0; // rotation
            this.rv = 0; // rotational velocity
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
                    this.player.rv -= constants_1.Constants.ACCEL;
                }
                else if (key_1.Key.isDown(key_1.Key.RIGHT)) {
                    this.player.rv += constants_1.Constants.ACCEL;
                }
                else {
                    this.player.rv *= 0.9;
                }
                if (Math.abs(this.player.rv) > constants_1.Constants.MAX_SPIN) {
                    this.player.rv = constants_1.Constants.MAX_SPIN * Math.sign(this.player.rv);
                }
                this.player.r += this.player.rv;
                this.player.x += this.player.dx;
                this.player.y += this.player.dy;
                this.player.dy += constants_1.Constants.GRAVITY;
                if (this.player.x > constants_1.Constants.WIDTH - this.player.w) {
                    this.player.x = constants_1.Constants.WIDTH - this.player.w;
                    this.player.dx *= -constants_1.Constants.X_BOUNCE;
                    this.player.dy = -this.player.rv * constants_1.Constants.WALL_FRICTION;
                }
                if (this.player.x < 0) {
                    this.player.x = 0;
                    this.player.dx *= -constants_1.Constants.X_BOUNCE;
                    this.player.dy = this.player.rv * constants_1.Constants.WALL_FRICTION;
                }
                if (this.player.y > constants_1.Constants.HEIGHT - this.player.h) {
                    this.player.y = constants_1.Constants.HEIGHT - this.player.h;
                    this.player.dy *= -constants_1.Constants.Y_BOUNCE;
                    this.player.dx = this.player.rv * constants_1.Constants.WALL_FRICTION;
                }
                if (this.player.y < 0) {
                    this.player.y = 0;
                    this.player.dy *= -constants_1.Constants.Y_BOUNCE;
                    this.player.dx = -this.player.rv * constants_1.Constants.WALL_FRICTION;
                }
            };
            this.draw = () => {
                this.ctx.fillStyle = "white";
                this.ctx.fillRect(0, 0, constants_1.Constants.WIDTH, constants_1.Constants.HEIGHT);
                this.ctx.fillStyle = "black";
                this.ctx.translate(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2);
                this.ctx.rotate(this.player.r);
                this.ctx.fillRect(-this.player.w / 2, -this.player.h / 2, this.player.w, this.player.h);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            };
            this.loop = () => {
                this.update();
                this.draw();
            };
            this.player = new player_1.Player(constants_1.Constants.WIDTH / 2, constants_1.Constants.HEIGHT / 2, constants_1.Constants.PLAYER_W, constants_1.Constants.PLAYER_H);
            this.ctx = document.getElementById("gameCanvas")
                .getContext("2d");
            key_1.Key.init(); // set up keyboard input handler
            setInterval(this.loop, 1000 / constants_1.Constants.FPS);
        }
    }
    var game = new Game();
    console.log(game);
});
//# sourceMappingURL=game.js.map