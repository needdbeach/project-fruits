class Fruit extends Item {
  constructor(config) {
    super(config);
    this.startX = config.x;
    this.startY = config.y;
    this.eater = null;
    this.eatTimer = null;
    this.respawnTimer = null; // timer event to respawn the fruit after tossed and not overlapping an "eater" instance
    this.flickerTimer = null;
    this.flickerCount = 0;
    this.isEaten = false;
  }

  update(time, delta) {
    super.update(time, delta);
    if (this.isEaten) {
      return;
    }
    const gameController = getGameController();
    if (!this.scene.physics.overlap(this, gameController.getGroupById("eaterGroup"), this.setEatTimer, null, this)) {
      if (this.eatTimer !== null) {
        this.eatTimer.remove(); // remove the event since instances are not overlapping
        this.eatTimer = null;
        this.eater = null;
      }
      // fruit needs to respawn?
      if (this.holder === null && (this.body.blocked.down || this.body.touching.down)) {
        if (this.respawnTimer === null) {
          // this.respawnTimer = this.scene.time.delayedCall(8000, this.respawn, [], this);
          this.respawnTimer = this.scene.time.addEvent({ delay: 1000, callback: this.respawn, callbackScope: this, loop: true });
        }
      } else {
        this.resetRespawn();
      }
    }
    // remove respawn time event when fruit is held
    if (this.holder !== null) {
      this.resetRespawn();
    }
  }

  setEatTimer(self, eater) {
    // fruit must not be held and fruit must be on the ground
    if (this.holder === null && (this.body.blocked.down || this.body.touching.down)) {
      if (this.eatTimer === null) {
        this.eater = eater;
        this.eatTimer = this.scene.time.delayedCall(3000, this.eaten, [], this);
      }
    } else {
      if (this.eatTimer !== null) {
        this.eatTimer.remove(); // remove the event from timeline
        this.eatTimer = null;
        this.eater = null;
      }
    }
  }

  eaten() {
    const gameController = getGameController();
    if (this.eater !== null && this.scene.physics.overlap(this, this.eater, null, null)) {
      this.isEaten = true;
      this.body.enable = false;
      // remove self from fruit group and scene
      const fruitGroup = gameController.getGroupById("fruitGroup");
      fruitGroup.killAndHide(this);
      // remove the respawn time event since fruit was eaten
      this.resetRespawn();
    }
    // remove the timer event
    if (this.eatTimer !== null) {
      this.eatTimer.remove();
    }
    this.eatTimer = null;
    this.eater = null;
  }

  respawn() {
    const gameController = getGameController();
    if (this.isEaten) {
      this.resetRespawn();
      return;
    }

    this.flickerCount++;
    if (this.flickerCount >= 5) { // five seconds
      if (this.flickerTimer === null) {
        this.flickerTimer = this.scene.time.addEvent({delay: 50, callback: this.flicker, callbackScope: this, loop: true});
      }
    }
    if (this.flickerCount >= 8) { // eight seconds
      // no overlapping occurred, reset fruit's position
      if (this.holder === null && !this.scene.physics.overlap(this, gameController.getGroupById("eaterGroup"), null, null)) {
        this.x = this.startX;
        this.y = this.startY;
        this.body.reset(this.x, this.y);
      }
      this.resetRespawn();
    }
  }

  flicker() {
    if (this.alpha !== 0) {
      this.setAlpha(0);
    } else {
      this.setAlpha(0.5);
    }
  }

  resetRespawn() {
    if (this.respawnTimer !== null) {
      this.respawnTimer.remove();
      this.respawnTimer = null;
    }
    if (this.flickerTimer !== null) {
      this.flickerTimer.remove();
      this.flickerTimer = null;
    }
    this.flickerCount = 0;
    this.setAlpha(1.0);
  }
}