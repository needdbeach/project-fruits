class Player extends BaseEntity {
  constructor(config) {
    super(config);
    this.spd = 0;
    this.spdMax = 80;
    this.acc = 7;
    this.dec = 10;
    this.turnSpd = 4;
    this.jumpHeight = 200;
    this.item = null;
  }

  preUpdateCall(time, delta) {
    super.preUpdateCall(time, delta);
    const gameController = getGameController();

    // jumping
    if ((this.body.blocked.down || this.body.touching.down) && gameController.getInputManager().isPressed(Phaser.Input.Keyboard.KeyCodes.UP)) {
      this.setVelocityY(-this.jumpHeight);
    }

    if (gameController.getInputManager().isPressed(Phaser.Input.Keyboard.KeyCodes.W)) {
      this.releaseItem();
    }

    this.hdir = 0;
    if (gameController.getInputManager().isDown(Phaser.Input.Keyboard.KeyCodes.LEFT) &&
        !(gameController.getInputManager().isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT))) {
      this.hdir = -1;
      this.direction = DIRECTION.LEFT;
    }
    if (gameController.getInputManager().isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT) &&
        !(gameController.getInputManager().isDown(Phaser.Input.Keyboard.KeyCodes.LEFT))) {
      this.hdir = 1;
      this.direction = DIRECTION.RIGHT;
    }
  }

  update(time, delta) {
    super.update(time, delta);
    const gameController = getGameController();

    // still aboard the moving platform?
    if (!this.body.touching.down) {
      // remove from the moving platform
      if (this.mvPlatform !== null) {
        this.mvPlatform.removePassenger(this.id);
        this.mvPlatform = null;
      }
    } else {
      // need to check and make sure the object this entity is "touching" is the moving platform we are assigned to

    }

    this.scene.physics.overlap(this, gameController.getGroupById("fruitGroup"), this.hold, null, this);

    // accelerate
    if (this.hdir !== 0) {
      let turnSpd = ((this.hdir === 1 && this.spd < 0) || (this.hdir === -1 && this.spd > 0)) ? this.turnSpd : 1;
      this.spd += this.acc * turnSpd * this.hdir;
      if (this.spd > 0 && this.spd >= this.spdMax) {
        this.spd = this.spdMax;
      } else if (this.spd < 0 && this.spd <= -this.spdMax) {
        this.spd = -this.spdMax;
      }
    } else {
      // decelerate
      if (this.spd > 0) {
        this.spd -= this.dec;
        if (this.spd <= 0) {
          this.spd = 0;
        }
      } else if (this.spd < 0) {
        this.spd += this.dec;
        if (this.spd >= 0) {
          this.spd = 0;
        }
      }
    }

    this.setVelocityX(this.spd);
  }

  postUpdate(time, delta) {
    super.postUpdate(time, delta);
  }

  collideSolid(player, platform) {
    let intersectRect = Phaser.Geom.Intersects.GetRectangleIntersection(player.getBounds(), platform.getBounds());
    // todo this does not currently take into account of non-tiles or one-way platforms
    if ((player.body.blocked.left || player.body.blocked.right) && intersectRect.height > 0) {
      player.spd = 0;
    }
    // become passenger of moving platform
    if (player.body.touching.down && platform instanceof MovingPlatform) {
      let boundsA = new Phaser.Geom.Rectangle(player.x, player.y + 1, player.getBounds().width, player.getBounds().height);
      if (Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, platform.getBounds())) {
        platform.addPassenger(player);
        player.mvPlatform = platform;
      }
    }
  }

  hold(player, item) {
    if (player.item !== null || item.preventHolder === player) {
      return;
    }
    item.body.setVelocityX(0);
    item.body.setVelocityY(0);
    item.body.setGravityY(0);
    item.body.reset(item.x, item.y);
    item.holder = player;
    player.item = item;
  }

  releaseItem() {
    const gameController = getGameController();
    if (this.item !== null) {
      // check if the item is overlapping a solid game object/tile
      if (!this.scene.physics.overlap(this.item, gameController.getTileMapLayer(0), this.itemStuckInWall, Collision.tile.isSolid, this)
          && !this.scene.physics.overlap(this.item, gameController.getGroupById("platformGroup"), this.itemStuckInWall, null, this)) {
        this.item.body.setVelocityX(this.body.velocity.x);
        this.item.body.setVelocityY(-350);
        this.item.body.setGravityY(500);
      }
      this.item.preventHolder = this.item.holder;
      this.item.holder = null;
      this.item = null;
    }
  }

  itemStuckInWall() {
    this.item.isInSolid = true;
    this.item.moveOutSolidDir = Direction.opposite(this.direction);
  }
}