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
define("constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Constants {
    }
    Constants.WIDTH = 640;
    Constants.HEIGHT = 480;
    Constants.FPS = 60;
    Constants.MAX_SPIN = 0.2;
    Constants.MAX_DX = 10;
    Constants.MAX_DY = 10;
    Constants.GRAVITY = 0.05;
    Constants.WALL_FRICTION = 30;
    Constants.WALL_ANGLE_SCALE = Math.PI * 0.45 / Constants.MAX_SPIN;
    Constants.X_BOUNCE = 1;
    Constants.Y_BOUNCE = 1;
    Constants.ACCEL = 1;
    Constants.SPIN_SCALE_FACTOR = 7; // visual effect
    Constants.CAMERA_LEAD = 10;
    Constants.TILESIZE = 16;
    Constants.PLAYER_W = 32;
    Constants.PLAYER_H = 32;
    exports.Constants = Constants;
});
define("level", ["require", "exports", "constants", "block", "camera"], function (require, exports, constants_1, block_1, camera_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Level {
        addBlock(x, y) {
            this.blocks.push(new block_1.Block(x * constants_1.Constants.TILESIZE, y * constants_1.Constants.TILESIZE, constants_1.Constants.TILESIZE, constants_1.Constants.TILESIZE));
        }
        pointInRect(pX, pY, rX, rY, rW, rH) {
            if (pX >= rX + rW || pX < rX)
                return false;
            if (pY >= rY + rH || pY < rY)
                return false;
            return true;
        }
        generate(game) {
            const CORRIDOR_WIDTH = 16;
            const CORRIDOR_HEIGHT = 1000;
            constants_1.Constants.LEVEL_W = constants_1.Constants.WIDTH;
            constants_1.Constants.LEVEL_H = CORRIDOR_HEIGHT * constants_1.Constants.TILESIZE;
            game.player.x = constants_1.Constants.LEVEL_W / 2 - game.player.w / 2;
            game.player.y = (CORRIDOR_HEIGHT - 5) * constants_1.Constants.TILESIZE;
            for (let x = 0; x < constants_1.Constants.WIDTH / constants_1.Constants.TILESIZE; x++) {
                for (let y = 0; y < CORRIDOR_HEIGHT; y++) {
                    if (this.pointInRect(x, y, constants_1.Constants.LEVEL_W / constants_1.Constants.TILESIZE / 2 - CORRIDOR_WIDTH / 2, 0, CORRIDOR_WIDTH, CORRIDOR_HEIGHT - 1)) {
                        continue;
                    }
                    else {
                        this.addBlock(x, y);
                    }
                }
            }
        }
        constructor(game) {
            this.blocks = new Array();
            this.generate(game);
        }
        onScreen(block) {
            if (block.x - camera_1.Camera.x > constants_1.Constants.WIDTH)
                return false;
            if (block.x - camera_1.Camera.x < -block.w)
                return false;
            if (block.y - camera_1.Camera.y > constants_1.Constants.HEIGHT)
                return false;
            if (block.y - camera_1.Camera.y < -block.h)
                return false;
            return true;
        }
        draw(ctx) {
            for (const block of this.blocks) {
                if (this.onScreen(block))
                    block.draw(ctx);
            }
        }
    }
    exports.Level = Level;
});
define("parallax", ["require", "exports", "constants", "game", "camera"], function (require, exports, constants_2, game_1, camera_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Parallax {
        constructor() {
            this.tileW = constants_2.Constants.TILESIZE * 2;
            this.tileH = constants_2.Constants.TILESIZE * 2;
        }
        draw(ctx) {
            let drawX = -(camera_2.Camera.x / 2);
            let drawY = -(camera_2.Camera.y / 2);
            while (drawX > 0)
                drawX -= this.tileW;
            while (drawX <= -this.tileW)
                drawX += this.tileW;
            while (drawX > 0)
                drawY -= this.tileH;
            while (drawX <= -this.tileH)
                drawY += this.tileH;
            for (let x = drawX; x < constants_2.Constants.WIDTH + this.tileW * 2; x += this.tileW) {
                for (let y = drawY; y < constants_2.Constants.HEIGHT + this.tileH * 2; y += this.tileH) {
                    ctx.drawImage(game_1.Game.spritesheet, 0, constants_2.Constants.TILESIZE * 2, constants_2.Constants.TILESIZE * 2, constants_2.Constants.TILESIZE * 2, x, y, this.tileW, this.tileH);
                }
            }
        }
    }
    exports.Parallax = Parallax;
});
define("game", ["require", "exports", "constants", "key", "player", "level", "camera", "parallax"], function (require, exports, constants_3, key_1, player_1, level_1, camera_3, parallax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        constructor() {
            this.update = () => {
                this.player.update();
                camera_3.Camera.updateTarget(this.player);
                camera_3.Camera.update();
            };
            this.draw = () => {
                this.ctx.fillStyle = "#301a52";
                this.ctx.fillRect(0, 0, constants_3.Constants.WIDTH, constants_3.Constants.HEIGHT);
                this.parallax.draw(this.ctx);
                this.level.draw(this.ctx);
                this.player.draw(this.ctx);
            };
            this.loop = () => {
                this.update();
                this.draw();
            };
            this.player = new player_1.Player(this, 0, // position gets set by Level ctor from level.png
            0, constants_3.Constants.PLAYER_W, constants_3.Constants.PLAYER_H);
            this.ctx = document.getElementById("gameCanvas").getContext("2d");
            key_1.Key.init(); // set up keyboard input handler
            Game.spritesheet = new Image();
            Game.spritesheet.src = "res/tileset.png";
            this.level = new level_1.Level(this);
            this.parallax = new parallax_1.Parallax();
            camera_3.Camera.setTarget(this.player);
            setInterval(this.loop, 1000 / constants_3.Constants.FPS);
        }
    }
    exports.Game = Game;
    var game = new Game();
});
define("player", ["require", "exports", "entity", "key", "constants", "game", "camera"], function (require, exports, entity_1, key_2, constants_4, game_2, camera_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player extends entity_1.Entity {
        constructor(game, x, y, w, h) {
            super(x, y, w, h);
            this.r = 0; // rotation
            this.rv = 0; // rotational velocity
            this.game = game;
        }
        hitTop() {
            this.dy *= -constants_4.Constants.Y_BOUNCE;
            this.dx += this.rv * constants_4.Constants.WALL_FRICTION;
        }
        hitBottom() {
            this.dy *= -constants_4.Constants.Y_BOUNCE;
            this.dx += -this.rv * constants_4.Constants.WALL_FRICTION;
        }
        hitLeft() {
            this.dx *= -constants_4.Constants.X_BOUNCE;
            this.dy += this.rv * constants_4.Constants.WALL_FRICTION;
        }
        hitRight() {
            this.dx *= -constants_4.Constants.X_BOUNCE;
            this.dy += -this.rv * constants_4.Constants.WALL_FRICTION;
        }
        edgeCollisions() {
            if (this.x > constants_4.Constants.WIDTH - this.w) {
                this.x = constants_4.Constants.WIDTH - this.w;
                this.hitRight();
            }
            if (this.x < 0) {
                this.x = 0;
                this.hitLeft();
            }
            if (this.y > constants_4.Constants.HEIGHT - this.h) {
                this.y = constants_4.Constants.HEIGHT - this.h;
                this.hitTop();
            }
            if (this.y < 0) {
                this.y = 0;
                this.hitBottom();
            }
        }
        colliding(block) {
            if (this.x >= block.x + block.w || this.x + this.w <= block.x)
                return false;
            if (this.y >= block.y + block.h || this.y + this.h <= block.y)
                return false;
            return true;
        }
        handleXCollisions() {
            for (const block of this.game.level.blocks) {
                if (this.colliding(block)) {
                    if (this.dx > 0) {
                        this.x = block.x - this.w;
                        this.hitRight();
                    }
                    else {
                        this.x = block.x + block.w;
                        this.hitLeft();
                    }
                }
            }
        }
        handleYCollisions() {
            for (const block of this.game.level.blocks) {
                if (this.colliding(block)) {
                    if (this.dy > 0) {
                        this.y = block.y - this.h;
                        this.hitTop();
                    }
                    else {
                        this.y = block.y + block.h;
                        this.hitBottom();
                    }
                }
            }
        }
        update() {
            if (key_2.Key.isDown(key_2.Key.LEFT)) {
                this.rv -= constants_4.Constants.ACCEL;
            }
            else if (key_2.Key.isDown(key_2.Key.RIGHT)) {
                this.rv += constants_4.Constants.ACCEL;
            }
            else {
                this.rv *= 0.9;
            }
            if (Math.abs(this.rv) > constants_4.Constants.MAX_SPIN) {
                this.rv = constants_4.Constants.MAX_SPIN * Math.sign(this.rv);
            }
            this.r += this.rv;
            // edgeCollisions();
            this.x += this.dx;
            this.handleXCollisions();
            this.y += this.dy;
            this.handleYCollisions();
            this.dy += constants_4.Constants.GRAVITY;
            this.dx = Math.sign(this.dx) * Math.min(Math.abs(this.dx), constants_4.Constants.MAX_DX);
            this.dy = Math.sign(this.dy) * Math.min(Math.abs(this.dy), constants_4.Constants.MAX_DY);
        }
        draw(ctx) {
            let scaleFactor = Math.max(1, Math.abs(this.rv) * constants_4.Constants.SPIN_SCALE_FACTOR);
            ctx.translate(this.x + this.w / 2 - camera_4.Camera.x, this.y + this.h / 2 - camera_4.Camera.y);
            ctx.rotate(this.r);
            ctx.drawImage(game_2.Game.spritesheet, constants_4.Constants.TILESIZE * 3, 0, constants_4.Constants.TILESIZE * 2, constants_4.Constants.TILESIZE * 2, -this.w / 2 * scaleFactor, -this.h / 2 * scaleFactor, this.w * scaleFactor, this.h * scaleFactor);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    exports.Player = Player;
});
define("camera", ["require", "exports", "constants"], function (require, exports, constants_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        static updateTarget(player) {
            this.targetX =
                player.x + player.w / 2 - constants_5.Constants.WIDTH / 2 + player.dx * constants_5.Constants.CAMERA_LEAD;
            this.targetY =
                player.y + player.w / 2 - constants_5.Constants.HEIGHT / 2 + player.dy * constants_5.Constants.CAMERA_LEAD;
        }
        static setTarget(player) {
            this.updateTarget(player);
            this.cx = this.targetX;
            this.cy = this.targetY;
        }
        static update() {
            this.cx += (this.targetX - this.cx) * 0.1;
            this.cy += (this.targetY - this.cy) * 0.1;
            if (this.cx > constants_5.Constants.LEVEL_W - constants_5.Constants.WIDTH)
                this.cx = constants_5.Constants.LEVEL_W - constants_5.Constants.WIDTH;
            if (this.cx < 0)
                this.cx = 0;
            if (this.cy > constants_5.Constants.LEVEL_H - constants_5.Constants.HEIGHT)
                this.cy = constants_5.Constants.LEVEL_H - constants_5.Constants.HEIGHT;
            if (this.cy < 0)
                this.cy = 0;
        }
        static get x() {
            return Math.floor(this.cx);
        }
        static get y() {
            return Math.floor(this.cy);
        }
    }
    Camera.cx = 0;
    Camera.cy = 0;
    Camera.targetX = 0;
    Camera.targetY = 0;
    Camera.targetDX = 0;
    Camera.targetDY = 0;
    exports.Camera = Camera;
});
define("block", ["require", "exports", "camera", "constants", "game"], function (require, exports, camera_5, constants_6, game_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Block {
        constructor(x, y, w, h) {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        draw(ctx) {
            ctx.drawImage(game_3.Game.spritesheet, 0, 0, constants_6.Constants.TILESIZE, constants_6.Constants.TILESIZE, this.x - camera_5.Camera.x, this.y - camera_5.Camera.y, this.w, this.h);
        }
    }
    exports.Block = Block;
});
//# sourceMappingURL=game.js.map