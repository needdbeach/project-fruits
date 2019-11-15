class InputManager {
  constructor() {
    this.keys = {}; // registered keys by name
    this.pressed = {}; // pressed keys
    this.down = {}; // keys currently down
    this.released = {}; // keys currently released
    this.up = {}; // keys up
  }

  // config {
  //   down (function),
  //   up (function)
  // }
  //
  addKey(scene, key, config) {
    this.keys[key] = scene.input.keyboard.addKey(key);
  }

  isPressed(key) {
    return this.pressed[key] === true;
  }

  isDown(key) {
    return this.down[key] === true;
  }

  isReleased(key) {
    return this.released[key] === true;
  }

  isUp(key) {
    return this.up[key] === true;
  }

  update() {
    for (const key in this.keys) {
      if (this.keys.hasOwnProperty(key)) {
        let keyObj = this.keys[key];
        if (keyObj.isDown) {
          if (!this.isPressed(key) && !this.isDown(key)) {
            this.pressed[key] = true;
            this.down[key] = true;
          } else {
            this.pressed[key] = false;
            this.down[key] = true;
          }
          // revert the 'up' status
          this.released[key] = false;
          this.up[key] = false;
        } else if (keyObj.isUp) {
          if (!this.isReleased(key) && !this.isUp(key)) {
            this.released[key] = true;
            this.up[key] = true;
          } else {
            this.released[key] = false;
            this.up[key] = true;
          }
          // revert the 'down' status
          this.pressed[key] = false;
          this.down[key] = false;
        }
      }
    }
  }
}