class PreLoaderScene extends Phaser.Scene {
  constructor() {
    super('PreLoader');
  }

  preload() {
    // Runs once, loads up assets (images, audio, etc.)
    this.load.image("tiles", "/imgs/tileset2.png");
    // this.load.image("tiles", "/imgs/tileset3.png");
    this.load.image("mvplatform", "/imgs/mvplatform.png");
    this.load.image("eater", "/imgs/eater.png");
    this.load.image("item", "/imgs/item.png");
    this.load.image("solid", "/imgs/solid.png");
    this.load.spritesheet("hunter", "imgs/hunter2.png", {frameWidth: 16, frameHeight: 16});
  }

  create() {
    //this.scene.start('Menu');
    this.scene.start('TestScene');
  }
}