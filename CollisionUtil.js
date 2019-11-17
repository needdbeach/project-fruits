const Collision = {
  tile: {
    isSolid: function(item, tile) {
      return tile.index === getGameController().getTileTypeIndex("solid");
    }
  }
};