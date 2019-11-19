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

    this.gameController.addTileType("empty", 0);
    this.gameController.addTileType("solid", 1);

    const configs = this.gameController.setTileMap({
      scene: this,
      key: "map",
      tileId: "tileset"
    });

    this.gameController.addTileLayer(this, TILE.LAYER_GROUND, configs.tiles, 0, 0);
    this.gameController.addTileLayer(this, TILE.LAYER_ONEWAY, configs.tiles, 0, 0); // represents one-way platforms

    this.gameController.getTileMapLayer(TILE.LAYER_GROUND).setCollision([2]);
    this.gameController.getTileMapLayer(TILE.LAYER_ONEWAY).setCollision([3]);

    this.gameController.getTileMapLayer(TILE.LAYER_ONEWAY).forEachTile(function(tile) {
      if (tile.index === 3) {
        tile.collideUp = true;
        tile.collideLeft = false;
        tile.collideRight = false;
        tile.collideDown = false;
      }
    });

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


    // Platforms
    const platformGroup = this.physics.add.group({
      classType: Platform
    });

    let mvplatform = new MovingPlatform({
      id: 4,
      scene: this,
      x: 160,
      y: 64,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "mvplatform",
      points: [{x: 160, y: 64}, {x: 240, y: 64}],
      from: 0,
      yoyo: true
    });
    platformGroup.add(mvplatform);

    this.physics.add.existing(mvplatform);
    mvplatform.body.immovable = true;


    let mvplatform2 = new MovingPlatform({
      id: 5,
      scene: this,
      x: 272,
      y: 208,
      movementType: GAME_CONSTANTS.movementType.NONE,
      texture: "mvplatform",
      points: [{x: 272, y: 208}, {x: 240, y: 64}],
      from: 0,
      yoyo: true
    });
    platformGroup.add(mvplatform2);

    this.physics.add.existing(mvplatform2);
    mvplatform2.body.immovable = true;


    // Setup the collisions

    // collision between player and "solid" tiles
    this.physics.add.collider(player, this.gameController.getTileMapLayer(TILE.LAYER_GROUND), player.collideSolid);
    this.physics.add.collider(player, this.gameController.getTileMapLayer(TILE.LAYER_ONEWAY), player.collideSolid);

    this.physics.add.collider(player, platformGroup, player.collideSolid);
    this.physics.add.collider(fruitGroup, platformGroup, Item.collideSolid);

    this.physics.add.collider(fruitGroup, this.gameController.getTileMapLayer(TILE.LAYER_GROUND));
    this.physics.add.collider(fruitGroup, this.gameController.getTileMapLayer(TILE.LAYER_ONEWAY));

    // Add the instances to the game controller

    this.gameController.addToScene(this, player); // add the player to the scene
    this.gameController.addEntity(player);

    this.gameController.addGroupToScene(this, fruitGroup); // add the fruit group to the scene
    this.gameController.addGroup("fruitGroup", fruitGroup);

    this.gameController.addGroupToScene(this, eaterGroup); // add the eater group to the scene
    this.gameController.addGroup("eaterGroup", eaterGroup);

    this.gameController.addGroupToScene(this, platformGroup); // add the platform group to the scene
    this.gameController.addGroup("platformGroup", platformGroup);
  }

  update(time, delta) {
    this.gameController.update(time, delta);
  }
}