class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene');
    this.gameController = getGameController();
  }

  create() {
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.W);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.A);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.D);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.UP);
    this.gameController.getInputManager().addKey(this, Phaser.Input.Keyboard.KeyCodes.DOWN);


    // Runs once, after all assets in preload are loaded
    // Load a map from a 2D array of tile indices
    const level = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    this.gameController.addTileType("empty", 0);
    this.gameController.addTileType("solid", 1);

    const configs = this.gameController.setTileMap({
      scene: this,
      layer: 0,
      id: "tiles",
      data: level
    });
    configs.tilemap.setCollision([1], true, false, configs.layer);

    // Player/Fruits/Other instances

    this.anims.create({
      key: 'hunterIdle',
      repeat: -1,
      frameRate: 3,
      frames: this.anims.generateFrameNames('hunter', {start: 0, end: 1})
    });

    let player = new Player({
      id: 0,
      scene: this,
      x: 90,
      y: 0,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "hunter"
    });
    player.play('hunterIdle');

    this.physics.add.existing(player);
    player.setGravityY(500);
    player.body.setSize(8, 8);
    player.body.setOffset(4, 8);

    // Fruit instances

    const fruitGroup = this.physics.add.group({
      classType: Fruit
    });

    let fruit = new Fruit({
      id: 1,
      scene: this,
      x: 60,
      y: 0,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "item"
    });
    fruitGroup.add(fruit);

    this.physics.add.existing(fruit);
    fruit.setGravityY(500);


    let fruit2 = new Fruit({
      id: 2,
      scene: this,
      x: 240,
      y: 0,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "item"
    });
    fruitGroup.add(fruit2);

    this.physics.add.existing(fruit2);
    fruit2.setGravityY(500);

    // Eater instances

    const eaterGroup = this.physics.add.group({
      classType: Eater
    });

    let eater = new Eater({
      id: 3,
      scene: this,
      x: 160,
      y: 104,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "eater"
    });
    eaterGroup.add(eater);
    this.physics.add.existing(eater);

    // Setup the collisions

    // collision between player and "solid" tiles
    this.physics.add.collider(player, configs.layer, player.collideSolid);
    this.physics.add.collider(fruitGroup, configs.layer);

    this.physics.add.overlap(player, fruitGroup, player.hold);

    // Add the instances to the game controller

    this.gameController.addToScene(this, player); // add the player to the scene
    this.gameController.addEntity(player);

    this.gameController.addGroupToScene(this, fruitGroup); // add the fruit group to the scene
    this.gameController.addGroup("fruitGroup", fruitGroup);

    this.gameController.addGroupToScene(this, eaterGroup); // add the eater group to the scene
    this.gameController.addGroup("eaterGroup", eaterGroup);
  }

  update(time, delta) {
    this.gameController.update(time, delta);
  }
}