define(function(require) {

	var assets = require('assets');
	var keyboard = require('input/keyboard');
	var fps = require('fps');
	var tile_space = require('tiles/space');
	var resolution = require('resolution');

	var station = require('station');

	var cellSize = resolution.cellSize;
	var width = resolution.width;
	var height = resolution.height;
	var rows = height / cellSize + 1;
	var cols = width / cellSize + 1;
	var w2 = Math.round(width / 2);
	var h2 = Math.round(height / 2);

	var offsetX = (Math.floor(width / cellSize) * cellSize) / 2;
	var offsetY = (height - Math.floor(height / cellSize) * cellSize) / 2;

	var visible_range_x = Math.ceil(resolution.width / 2 / cellSize);
	var visible_range_y = Math.ceil(resolution.height / 2 / cellSize);

	var speed = 3;
	var status = 'begin';

	var avatar = {
		x: 0,
		y: 0,
		x_: function() {
			return Math.floor(this.x / cellSize);
		},
		y_: function() {
			return Math.floor(this.y / cellSize);
		},
		facing: 0
	};

	var cache = {};

	var tiles = {
		get: function(x, y) {

			if (cache[x] && cache[x][y]) return cache[x][y];

			var tile = tile_space(x, y);

			cache[x] = (cache[x] || {});
			cache[x][y] = tile;

			return tile;
		}
	};

	function initialize(loop) {
		assets.files = ['tiles.fw.png'];
		assets.load(function() {
			station(cache);
			loop();
		});
	}

	function draw(ctx) {

		var row, col;

		// set the base layer
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, width, height);
		ctx.beginPath();

		var gridOffsetX = avatar.x % cellSize - offsetX;
		var gridOffsetY = avatar.y % cellSize - offsetY;

		ctx.save();
		ctx.translate(w2, h2);

		//draw tiles
		var x_min = avatar.x_() - visible_range_x;
		var x_max = avatar.x_() + visible_range_x;
		var y_min = avatar.y_() - visible_range_y;
		var y_max = avatar.y_() + visible_range_y;

		for (var x = x_min; x <= x_max; x++) {
			for (var y = y_min; y <= y_max; y++) {
				var tile = tiles.get(x, y);
				var tx = (tile.x * cellSize) - avatar.x;
				var ty = (tile.y * cellSize) - avatar.y;

				ctx.save();
				ctx.translate(tx, ty);
				tile.draw(ctx);
				ctx.restore();
			}
		}

		// avatar
		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.beginPath();
		ctx.rotate(avatar.facing);
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -4);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.restore();

		ctx.restore();

		// draw the grid
		// for (var r = 0; r < rows; r++) {
		// 	row = r * cellSize - gridOffsetY;
		// 	ctx.moveTo(0, row);
		// 	ctx.lineTo(width, row);
		// }

		// for (var c = 0; c < cols; c++) {
		// 	col = c * cellSize - gridOffsetX;
		// 	ctx.moveTo(col, 0);
		// 	ctx.lineTo(col, height);
		// }

		// ctx.strokeStyle = 'rgba(255,0,0,0.5)';
		// ctx.stroke();

		// status
		ctx.font = '16px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(status, 8, 20);
		ctx.fillStyle = 'yellow';
		ctx.fillText(status, 9, 21);

		fps.draw(ctx);
	}

	var pressed = {
		up: keyboard.bindCheckFor('w'),
		down: keyboard.bindCheckFor('s'),
		left: keyboard.bindCheckFor('a'),
		right: keyboard.bindCheckFor('d'),
		activate: keyboard.bindCheckFor('e')
	};

	var lastActivated = new Date();

	function update(elapsed) {

		if (pressed.up()) {
			var newY = Math.floor((avatar.y - speed) / cellSize);
			if (cache[avatar.x_()][newY].walkable) avatar.y -= speed;
			avatar.facing = 0;
		}
		if (pressed.right()) {
			var newX = Math.floor((avatar.x + speed) / cellSize);
			if (cache[newX][avatar.y_()].walkable) avatar.x += speed;
			avatar.facing = Math.PI / 2;
		}
		if (pressed.down()) {
			var newY = Math.floor((avatar.y + speed) / cellSize);
			if (cache[avatar.x_()][newY].walkable) avatar.y += speed;
			avatar.facing = Math.PI;

		}
		if (pressed.left()) {
			var newX = Math.floor((avatar.x - speed) / cellSize);
			if (cache[newX][avatar.y_()].walkable) avatar.x -= speed;
			avatar.facing = Math.PI / 2 * 3;
		}

		if (pressed.activate()) {
			var delta = new Date() - lastActivated;
			if (delta > 300) {
				lastActivated = new Date();
				var x = Math.round(Math.cos(avatar.facing));
				var y = Math.round(Math.sin(avatar.facing));

				var target = {
					x: avatar.x_() + y,
					y: avatar.y_() - x
				};

				var targetTile = tiles.get(target.x, target.y);
				if (targetTile.activate) targetTile.activate();
				console.log('activating ' + target.x + ',' + target.y);
			}
		}

		status = tiles.get(avatar.x_(), avatar.y_()).type;

		fps.update(elapsed);

	}

	return {
		initialize: initialize,
		update: update,
		draw: draw
	};

});