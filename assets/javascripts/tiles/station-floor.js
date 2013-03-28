define(function(require) {

	var assets = require('assets');
	var resolution = require('resolution');
	var tileSize = resolution.cellSize;

return function(x, y) {
	var sprite = assets['tiles.fw.png'];

	return {
		spriteX: 96,
		spriteY: 64,
		x: x,
		y: y,
		draw: function(ctx) {
			ctx.drawImage(sprite, this.spriteX, this.spriteY, 32, 32, 0, 0, tileSize, tileSize);
		},
		type: 'station floor',
		walkable: true

	};
}
});