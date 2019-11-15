class Item extends BaseEntity {
  constructor(config) {
    super(config);
    this.holder = null;
    this.preventHolder = null; // reference to previous holder in order to check if bounds are no longer intersecting until item can be held
    this.isInSolid = false;
    this.moveOutSolidDir = DIRECTION.NONE;
  }

  update(time, delta) {
    super.update(time, delta);

    if (this.isInSolid) {
      if (!this.scene.physics.overlap(this, getGameController().getTileMapLayer(0), this.moveOutSolid, this.isSolidTile, this)) {
        // apply gravity
        this.body.reset(this.x, this.y);
        this.body.setGravityY(this.gravity);
        this.isInSolid = false;
      }
    }

    // apply deceleration
    if (!this.holder && this.body.blocked.down) {
      let xs = this.body.velocity.x;
      if (xs > 0) {
        xs -= this.dec;
        if (xs < 0) {
          xs = 0;
        }
      } else if (xs < 0) {
        xs += this.dec;
        if (xs > 0) {
          xs = 0;
        }
      }
      this.body.setVelocityX(xs);
    }
    // allow the previous holder to hold this item once no intersection exists
    if (this.preventHolder !== null) {
      const intersect = Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.preventHolder.getBounds());
      if (!intersect) {
        this.preventHolder = null;
      }
    }
  }

  postUpdate(time, delta) {
    super.postUpdate(time, delta);
    if (this.holder !== null) {
      let dir = this.holder.direction === DIRECTION.LEFT ? -1 : 1;
      this.x = this.holder.x + (this.holder.width / 2) * dir;
      this.y = this.holder.y;
    }
  }

  isSolidTile(item, tile) {
    return tile.index === getGameController().getTileTypeIndex("solid");
  }

  /**
   * Move the item from out of a solid game object/tile
   */
  moveOutSolid(item, solid) {
    if (this.moveOutSolidDir === DIRECTION.LEFT) {
      this.x -= 1;
    } else if (this.moveOutSolidDir === DIRECTION.RIGHT) {
      this.x += 1;
    }
  }
}