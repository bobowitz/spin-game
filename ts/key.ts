export class Key {
  static _pressed = {};

  static SPACE = 32;
  static LEFT = 37;
  static UP = 38;
  static RIGHT = 39;
  static DOWN = 40;
  static W = 87;
  static A = 65;
  static S = 83;
  static D = 68;
  public static init() {
    window.addEventListener(
      'keyup',
      event => {
        this.onKeyUp(event);
      },
      false
    );
    window.addEventListener(
      'keydown',
      event => {
        this.onKeyDown(event);
      },
      false
    );
  }

  public static isDown(keyCode: number) {
    return this._pressed[keyCode];
  }

  public static onKeyDown(event: KeyboardEvent) {
    this._pressed[event.keyCode] = true;
  }

  public static onKeyUp(event: KeyboardEvent) {
    delete this._pressed[event.keyCode];
  }
}
