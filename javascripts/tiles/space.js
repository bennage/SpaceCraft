define(function(require) {

	var assets = require('assets');
	var resolution = require('resolution');
	var tileSize = resolution.cellSize;
	var offSet = tileSize / 2;

	return function(x, y) {
		var sprite = assets['tiles.fw.png'];
		var rotation = Math.floor(Math.random() * 4) * Math.PI / 2;

		return {
			x: x,
			y: y,
			draw: function(ctx) {
				ctx.save();
				ctx.translate(offSet, offSet);
				ctx.rotate(rotation);
				ctx.drawImage(sprite, 0, 64, 64, 64, -offSet, -offSet, tileSize, tileSize);
				ctx.restore();
			},
			type: 'deep space'

		};
	}
});