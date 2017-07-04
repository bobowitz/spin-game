export class Key {
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
//# sourceMappingURL=key.js.map