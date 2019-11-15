const GAME_CONSTANTS = {
  ROOM_WIDTH: 320,
  ROOM_HEIGHT: 240,
  TILE_SIZE: 16,
  STEP_SIZE: 16, // represents the distance between positions an entity can move to when on a grid
  movementType: {
    NONE: -1,
    STANDARD: 0,
    GRID: 1,
    PROJECTILE: 2
  }
};