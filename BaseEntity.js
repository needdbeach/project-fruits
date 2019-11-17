class BaseEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.texture);
    this.id = config.id;
    this.direction = DIRECTION.NONE;
    this.movementType = config.movementType || GAME_CONSTANTS.movementType.STANDARD;
    this.spd = 0;
    this.spdMax = 1.3;
    this.acc = 7;
    this.dec = 10;
    this.gravity = 500;
    this.hdir = 0;
    this.turnSpd = 6;

    this.mvPlatform = null; // represents the reference to the moving platform this entity is aboard

    this.tweenPreventMovement = false;
  }

  preUpdateCall(time, delta) {
    if (this.scene.preventMovement) { // all entities must not be moving before an entity can move
      return;
    }
  }

  update(time, delta) {
    super.update(time, delta);
  }

  postUpdate(time, delta) {

  }

  getDirection() {
    return DIRECTION.NONE;
  }

  /**
   * Determines if the entity is currently preventing movement because tweening is in process.
   * @return {boolean}
   */
  preventMovementForTween() {
    return this.tweenPreventMovement;
  }
}