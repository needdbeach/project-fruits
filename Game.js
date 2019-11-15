class Game extends Phaser.Game {
  constructor(config) {
    super(config);
    this.scene.add('Boot', BootScene);
    this.scene.add('PreLoader', PreLoaderScene);
    this.scene.add('TestScene', TestScene);
    // start the game
    this.scene.start('Boot');
  }
}

window.game = new Game(config);
window.game.gameController = new GameController(window.game);

function getGameController() {
  return window.game.gameController;
}