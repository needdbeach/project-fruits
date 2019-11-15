class Item extends BaseEntity {
  constructor(config) {
    super(config);
    this.holder = null;
    this.preventHolder = null; // reference to previous holder in order to check if bounds are no longer intersecting until item can be held
  }

  update(time, delta) {
    super.update(time, delta);

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
}