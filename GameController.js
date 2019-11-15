class GameController {
  constructor(game) {
    this.game = game;
    this.inputManager = new InputManager();

    //this.instanceControllers = {}; // a map of the instance controllers
    this.entities = {}; // a map of all entities for the current scene
    this.entityToPosMap = null;
    this.entityFromPosMap = null;

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
    const layerId = config.layer || 0;
    const tileId = config.id;
    const data = config.data; // represents the layout of tiles on the scene
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    scene.tilemap = scene.make.tilemap({ data: data, tileWidth: GAME_CONSTANTS.TILE_SIZE, tileHeight: GAME_CONSTANTS.TILE_SIZE });
    const tiles = scene.tilemap.addTilesetImage(tileId);
    const layer = scene.tilemap.createStaticLayer(layerId, tiles, 0, 0);
    return {tilemap: scene.tilemap, layer: layer};
  }

  getTileMap(scene) {
    return scene.tilemap;
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

    // used to store each entities to/from positions in a map
    this.entityToPosMap = {};
    this.entityFromPosMap = {};

    // preupdate
    for (const id in this.entities) {
      if (this.entities.hasOwnProperty(id)) {
        const entity = this.entities[id];
        entity.preUpdateCall(time, delta);
      }
    }

    // grid-based collisions need to be handled before update method
    //this.handleGridCollisions();

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