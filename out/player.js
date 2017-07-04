import { Entity } from "./entity";
export class Player extends Entity {
    constructor() {
        super(...arguments);
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.dx = 0;
        this.dy = 0;
        this.r = 0; // rotation
        this.rv = 0; // rotational velocity
    }
}
//# sourceMappingURL=player.js.map