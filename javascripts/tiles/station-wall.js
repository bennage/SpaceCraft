define(function(require) {

	var assets = require('assets');
	var resolution = require('resolution');
	var sprites;

	function createRotatedSprites() {
		var baseSheet = assets['tiles.fw.png'];

		var wall = {
			x: 64,
			y: 64
		};
		var corner = {
			x: 64,
			y: 96
		};
		var outer = {
			x: 96,
			y: 96
		};

		var size = 32;
		var offset = size / 2;

		var sheet = document.createElement('canvas');
		var ctx = sheet.getContext('2d');
		sheet.setAttribute('height', size * 3);
		sheet.setAttribute('width', size * 4);
		// document.body.appendChild(sheet);

		var x, y;
		// left, top, right, bottom
		for (var i = 0; i < 4; i++) {
			x = size * i;

			y = 0;
			ctx.save();
			ctx.translate(x + offset, y + offset);
			ctx.rotate(i * Math.PI / 2);
			ctx.drawImage(baseSheet, wall.x, wall.y, size, size, -offset, -offset, size, size);
			ctx.restore();

			y = size;
			ctx.save();
			ctx.translate(x + offset, y + offset);
			ctx.rotate(i * Math.PI / 2);
			ctx.drawImage(baseSheet, corner.x, corner.y, size, size, -offset, -offset, size, size);
			ctx.restore();

			y = size * 2;
			ctx.save();
			ctx.translate(x + offset, y + offset);
			ctx.rotate(i * Math.PI / 2);
			ctx.drawImage(baseSheet, outer.x, outer.y, size, size, -offset, -offset, size, size);
			ctx.restore();
		}

		return sheet;
	}

	var tileSize = resolution.cellSize;

	function getRelativePositions(tile, adjacent) {
		var checking, positions = {};
		var col, row;

		// establish the relative postions 
		for (var i = adjacent.length - 1; i >= 0; i--) {
			checking = adjacent[i];

			// 1st column » l
			if (checking.x === tile.x - 1) {
				col = 'l';
			} else

			// 2nd column » c
			if (checking.x === tile.x) {
				col = 'c';
			} else

			// 3rd column » r
			if (checking.x === tile.x + 1) {
				col = 'r';
			}

			// 1st row » t
			if (checking.y === tile.y - 1) {
				row = 't';
			} else

			// 2nd row » m
			if (checking.y === tile.y) {
				row = 'm';
			} else

			// 3rd row » b
			if (checking.y === tile.y + 1) {
				row = 'b';
			}

			positions[row + col] = checking.type;
		}

		return positions;
	}

	function adjustSprite(adjacent) {
		if (this.x === -1 && this.y === 0) debugger;

		var positions = getRelativePositions(this, adjacent);

		if (positions.ml === 'station floor') {
			// x x x
			// x o f
			// x x x
			this.spriteX = 64;
			this.spriteY = 0;
		}

		if (positions.mr === 'station floor') {
			// x x x
			// f o x
			// x x x
			this.spriteX = 0;
			this.spriteY = 0;
		}

		if (positions.tc === 'station floor') {
			// x f x
			// x o x
			// x x x
			this.spriteX = 96;
			this.spriteY = 0;
		}

		if (positions.bc === 'station floor') {
			// x x x
			// x o x
			// x f x
			this.spriteX = 32;
			this.spriteY = 0;
		}

		// vertical walls
		if (positions.tc === this.type && positions.bc === this.type) {

			// x | f
			// x o f
			// x | f
			if (positions.mr === 'station floor') {
				this.spriteX = 0;
				this.spriteY = 0;
			} else

			// f | x
			// f o x
			// f | x
			if (positions.ml === 'station floor') {
				this.spriteX = 64;
				this.spriteY = 0;
			}
		} else
		// horizontal walls
		if (positions.ml === this.type && positions.mr === this.type) {
			// x x x
			// - o -
			// f f f
			if (positions.bc === 'station floor') {
				this.spriteX = 32;
				this.spriteY = 0;
			} else

			// f f f
			// - o -
			// x x x
			if (positions.tc === 'station floor') {
				this.spriteX = 96;
				this.spriteY = 0;
			}

		} else
		// top corners
		if (positions.bc === this.type) {

			// x x x
			// x o -
			// x | f
			if (positions.mr === this.type && positions.br === 'station floor') {
				this.spriteX = 32;
				this.spriteY = 32;
			} else

			// x x x
			// - o x
			// f | x
			if (positions.ml === this.type && positions.bl === 'station floor') {
				this.spriteX = 64;
				this.spriteY = 32;
			}
		} else
		// bottom corners
		if (positions.tc === this.type) {

			// f | x
			// - o x
			// x x x
			if (positions.ml === this.type && positions.tl === 'station floor') {
				this.spriteX = 96;
				this.spriteY = 32;
			} else

			// x | f
			// x o -
			// x x x
			if (positions.mr === this.type && positions.tr === 'station floor') {
				this.spriteX = 0;
				this.spriteY = 32;
			}
		}

		// outer
		if (positions.bc === 'station floor' && positions.mr === 'station floor') {
			// x x x
			// x o f
			// x f f
			this.spriteX = 32;
			this.spriteY = 64;
		} else if (positions.bc === 'station floor' && positions.ml === 'station floor') {
			// x x x
			// f o x
			// f f x
			this.spriteX = 64;
			this.spriteY = 64;
		} else if (positions.tc === 'station floor' && positions.ml === 'station floor') {
			// f f x
			// f o x
			// x x x
			this.spriteX = 96;
			this.spriteY = 64;
		} else if (positions.tc === 'station floor' && positions.mr === 'station floor') {
			// x f f
			// x o f
			// x x x
			this.spriteX = 0;
			this.spriteY = 64;
		}
	}

	return function(x, y) {
		if (!sprites) {
			sprites = createRotatedSprites();
		}

		return {
			x: x,
			y: y,
			type: 'station wall',
			spriteX: -32,
			spriteY: -32,
			draw: function(ctx) {
				ctx.drawImage(sprites, this.spriteX, this.spriteY, 32, 32, 0, 0, tileSize, tileSize);
			},
			adjustSprite: adjustSprite,


		};
	}
});