const config = {
  type: Phaser.AUTO, // which renderer to use
  width: GAME_CONSTANTS.ROOM_WIDTH, // canvas width in pixels
  height: GAME_CONSTANTS.ROOM_HEIGHT, // canvas height in pixels
  pixelArt: true,
  zoom: 3,
  parent: "game", // id of the DOM element to add the canvas
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  // scene: {
  //   preload: preload,
  //   create: create,
  //   update: update
  // }
};