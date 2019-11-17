class MovingPlatform extends Platform {
  constructor(config) {
    super(config);

    this.passengers = {};

    this.points = config.points || [];
    this.from = config.from || this.points.length ? 0 : -1;
    this.to = -1; // represents the index of the point the platform is moving towards
    this.reverse = config.reverse || false;
    this.yoyo = config.yoyo || false;

    this.xprev = this.x;
    this.yprev = this.y;

    // if (config.movement) {
    //   config.movement.call(this);
    // }
  }

  update(time, delta) {
    super.update(time, delta);

    this.move();

    for (const id in this.passengers) {
      if (this.passengers.hasOwnProperty(id)) {
        const passenger = this.passengers[id];

        // move the passenger
        if (passenger.mvPlatform === this && passenger.body.touching.down) {
          passenger.x += this.x - this.xprev;
          passenger.y += this.y - this.yprev;
        }
      }
    }
  }

  postUpdate(time, delta) {
    super.postUpdate(time, delta);

    this.xprev = this.x;
    this.yprev = this.y;
  }

  move() {
    if (this.points.length === 1) {
      return;
    }
    // setup the initial 'to' traversal of the platform
    if (this.to === -1) {
      if (this.reverse) {
        if (this.from > 0) {
          this.to = this.from - 1;
        } else if (this.yoyo) {
          this.to = this.from + 1;
          this.reverse = false;
        } else {
          return;
        }
      } else {
        if (this.from < this.points.length - 1) {
          this.to = this.from + 1;
        } else if (this.yoyo) {
          this.to = this.from - 1;
          this.reverse = true;
        } else {
          return;
        }
      }
    }
    // platform movement has completed
    if (this.from === this.to) {
      if (this.yoyo) {
        if (this.reverse && this.from === 0) {
          this.to = 1;
          this.reverse = false;
        } else if (this.from === this.points.length - 1) {
          this.to = this.from - 1;
          this.reverse = true;
        }
      } else {
        return;
      }
    }
    // invoke the platform movement
    let pFrom = this.points[this.from];
    let pTo = this.points[this.to];

    // horizontal
    if (this.x < pTo.x) {
      this.x += 0.5;
    } else if (this.x > pTo.x) {
      this.x -= 0.5;
    }
    // vertical
    if (this.y < pTo.y) {
      this.y += 0.5;
    } else if (this.y > pTo.y) {
      this.y -= 0.5;
    }
    // check if completed traversal
    if (((pFrom.x <= pTo.x && this.x >= pTo.x) || (pFrom.x >= pTo.x && this.x <= pTo.x))
        && ((pFrom.y <= pTo.y && this.y >= pTo.y) || (pFrom.y >= pTo.y && this.y <= pTo.y))) {
      this.from = this.to;
      if (this.reverse && this.to > 0) {
        this.to = this.to - 1;
      } else if (this.to < this.points.length - 1) {
        this.to = this.to + 1;
      }
    }
  }

  addPassenger(passenger) {
    if (!this.passengers.hasOwnProperty(passenger.id)) {
      this.passengers[passenger.id] = passenger;
    }
  }

  removePassenger(id) {
    if (this.passengers.hasOwnProperty(id)) {
      delete this.passengers[id];
    }
  }
}