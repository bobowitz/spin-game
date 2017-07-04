import { Player } from "./player";
import { Constants } from "./constants";

export class Camera {
  static cx = 0;
  static cy = 0;
  static targetX = 0;
  static targetY = 0;
  static targetDX = 0;
  static targetDY = 0;

  static updateTarget(player: Player) {
    this.targetX =
      player.x + player.w / 2 - Constants.WIDTH / 2 + player.dx * Constants.CAMERA_LEAD;
    this.targetY =
      player.y + player.w / 2 - Constants.HEIGHT / 2 + player.dy * Constants.CAMERA_LEAD;
  }

  static update() {
    this.cx += (this.targetX - this.cx) * 0.1;
    this.cy += (this.targetY - this.cy) * 0.1;

    if (this.cx > Constants.LEVEL_W - Constants.WIDTH)
      this.cx = Constants.LEVEL_W - Constants.WIDTH;
    if (this.cx < 0) this.cx = 0;
    if (this.cy > Constants.LEVEL_H - Constants.HEIGHT)
      this.cy = Constants.LEVEL_H - Constants.HEIGHT;
    if (this.cy < 0) this.cy = 0;
  }

  static get x() {
    return Math.floor(this.cx);
  }

  static get y() {
    return Math.floor(this.cy);
  }
}
