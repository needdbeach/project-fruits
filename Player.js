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
    if (this.body.blocked.down && gameController.getInputManager().isPressed(Phaser.Input.Keyboard.KeyCodes.UP)) {
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

  collideSolid(player, tile) {
    const intersectRect = Phaser.Geom.Intersects.GetRectangleIntersection(player.getBounds(), tile.getBounds());
    if ((player.body.blocked.left || player.body.blocked.right) && intersectRect.height > 0) {
      player.spd = 0;
    }
  }

  hold(player, item) {
    //const fruitGroup = getGameController().getGroupById("fruitGroup");
    //fruitGroup.killAndHide(item);
    //item.body.enable = false;
    if (item.preventHolder === player) {
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
    if (this.item !== null) {
      this.item.preventHolder = this.item.holder;
      this.item.holder = null;
      this.item.body.setVelocityX(this.body.velocity.x);
      this.item.body.setVelocityY(-350);
      this.item.body.setGravityY(500);
      this.item = null;
    }
  }
}