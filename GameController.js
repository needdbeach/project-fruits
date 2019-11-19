class GameController {
  constructor(game) {
    this.game = game;
    this.inputManager = new InputManager();

    //this.instanceControllers = {}; // a map of the instance controllers
    this.entities = {}; // a map of all entities for the current scene
    this.entityToPosMap = null;
    this.entityFromPosMap = null;

    this.tilemap = {
      layers: {},
      tileTypes: {} // denotes an identifier for the tile indices
    };
    this.groups = {}; // a map of all groups for the current scene

    this.preventMovement = false;
  }

  addToScene(scene, instance) {
    scene.add.existing(instance);
  }

  addGroupToScene(scene, group) {
    let children = group.getChildren();
    for (let i = 0; i < children.length; i++) {
      scene.add.existing(children[i]);
    }
  }

  addEntity(entity) {
    this.entities[entity.id] = entity;
  }

  addGroup(groupId, group) {
    let children = group.getChildren();
    for (let i = 0; i < children.length; i++) {
      this.entities[children[i].id] = children[i];
    }
    this.groups[groupId] = group;
  }

  getGroupById(groupId) {
    return this.groups[groupId];
  }

  getInputManager() {
    return this.inputManager;
  }

  // addInstanceController(instanceController) {
  //   this.instanceControllers[instanceController.id] = instanceController.controller;
  // }

  getUserControlsEntityObserver() {
    return this.userControlsEntityObserver;
  }

  isMovementPrevented() {
    return this.preventMovement;
  }

  setTileMap(config) {
    const scene = config.scene;
    const data = config.data; // represents the layout of tiles on the scene
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    scene.tilemap = scene.make.tilemap({ key: config.key });
    const tiles = scene.tilemap.addTilesetImage(config.tileId);
    return {tilemap: scene.tilemap, tiles: tiles};
  }

  addTileLayer(scene, layerId, tiles, x, y) {
    this.tilemap.layers[layerId] = scene.tilemap.createStaticLayer(layerId, tiles, x, y);
  }

  getTileMap(scene) {
    return scene.tilemap;
  }

  getTileMapLayer(layerId) {
    return this.tilemap.layers[layerId || 0];
  }

  addTileType(type, index) {
    this.tilemap.tileTypes[type] = index;
  }

  getTileTypeIndex(type) {
    return this.tilemap.tileTypes[type];
  }

  update(scene, time, delta) {
    // Runs once per frame for the duration of the scene
    for (const id in this.entities) {
      if (this.entities.hasOwnProperty(id)) {
        const entity = this.entities[id];
        if ((entity.moving && entity.moving()) || (entity.preventMovementForTween && entity.preventMovementForTween())) {
          this.preventMovement = true; // prevents non-moving entities from moving until entities are all stationary
          break;
        }
      }
    }

    // update the input manager
    this.inputManager.update();

    // preupdate
    for (const id in this.entities) {
      if (this.entities.hasOwnProperty(id)) {
        const entity = this.entities[id];
        entity.preUpdateCall(time, delta);
      }
    }

    // update
    for (const id in this.entities) {
      if (this.entities.hasOwnProperty(id)) {
        const entity = this.entities[id];
        entity.update(time, delta);
      }
    }

    // post update
    for (const id in this.entities) {
      if (this.entities.hasOwnProperty(id)) {
        const entity = this.entities[id];
        entity.postUpdate(time, delta);
      }
    }

    this.preventMovement = false;
  }
}