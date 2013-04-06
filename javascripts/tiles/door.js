define(function(require) {

	var assets = require('assets');
	var resolution = require('resolution');
	var tileSize = resolution.cellSize;
	var offSet = tileSize / 2;

	return function(x, y) {
		var sprite = assets['tiles.fw.png'];

		return {
			x: x,
			y: y,
			draw: function(ctx) {
				ctx.save();
				ctx.translate(offSet, offSet);
				// ctx.rotate(rotation);
				if (this.walkable) {
					ctx.drawImage(sprite, 128, 64, 32, 32, -offSet, -offSet, tileSize, tileSize);

				} else {
					ctx.drawImage(sprite, 128, 96, 32, 32, -offSet, -offSet, tileSize, tileSize);

				}
				ctx.restore();
			},
			type: 'door',
			walkable: false,
			activate: function() {
				this.walkable = !this.walkable;
			}

		};
	}
});