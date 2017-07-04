export class Constants {
  static readonly WIDTH = 640;
  static readonly HEIGHT = 480;

  static readonly FPS = 60;
  static readonly MAX_SPIN = 0.2;
  static readonly MAX_DX = 10;
  static readonly MAX_DY = 10;
  static readonly GRAVITY = 0.05;
  static readonly WALL_FRICTION = 30;
  static readonly WALL_ANGLE_SCALE = Math.PI * 0.45 / Constants.MAX_SPIN;
  static readonly X_BOUNCE = 1;
  static readonly Y_BOUNCE = 1;
  static readonly ACCEL = 1;
  static readonly SPIN_SCALE_FACTOR = 7; // visual effect

  static readonly CAMERA_LEAD = 10;

  static readonly TILESIZE = 16;

  static LEVEL_W: number;
  static LEVEL_H: number;

  static readonly PLAYER_W = 32;
  static readonly PLAYER_H = 32;
}
