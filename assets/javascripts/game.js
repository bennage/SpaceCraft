define(function(require) {

	var assets = require('assets');
	var keyboard = require('input/keyboard');

	var cellSize = 32;

	var avatar = {
		x: 0,
		y: 0,
		x_: function() {
			return Math.floor(this.x / cellSize);
		},
		y_: function() {
			return Math.floor(this.y / cellSize);
		}
	};

	var cache = {};
	var types = {
		'0': 'blue',
		'1': 'gray',
		'2': 'green',
		'3': 'white',
	};

	function getTileType() {
		var r = Math.round(Math.random() * 3);
		return types[r];
	}
	var tiles = {
		get: function(x, y) {

			if (cache[x] && cache[x][y]) return cache[x][y];

			var tile = {
				x: x,
				y: y,
				type: getTileType()
			};

			cache[x] = (cache[x] || {});
			cache[x][y] = tile;

			return tile;
		}
	};

	function initialize(loop) {
		assets.files = ['tiles.fw.png'];
		assets.load(loop);
	};

	function draw(ctx) {

		var height = ctx.canvas.height;
		var width = ctx.canvas.width;
		var w2 = Math.round(width / 2);
		var h2 = Math.round(height / 2);

		var rows = height / cellSize + 1;
		var cols = width / cellSize + 1;
		var row, col;

		// set the base layer
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, width, height);
		ctx.beginPath();

		var offsetX = avatar.x % cellSize - (width - Math.floor(width / cellSize) * cellSize) / 2;
		var offsetY = avatar.y % cellSize - (height - Math.floor(height / cellSize) * cellSize) / 2;

		// draw the grid
		for (var r = 0; r < rows; r++) {
			row = r * cellSize - offsetY;
			ctx.moveTo(0, row);
			ctx.lineTo(width, row);
		}

		for (var c = 0; c < cols; c++) {
			col = c * cellSize - offsetX;
			ctx.moveTo(col, 0);
			ctx.lineTo(col, height);
		}

		ctx.strokeStyle = 'rgba(255,0,0,0.6)';
		ctx.stroke();

		ctx.save();
		ctx.translate(w2, h2);

		var visible_range = 10;
		//draw tiles
		var x_min = avatar.x_() - visible_range;
		var x_max = avatar.x_() + visible_range;
		var y_min = avatar.y_() - visible_range;
		var y_max = avatar.y_() + visible_range;

		for (var x = x_min; x <= x_max; x++) {
			for (var y = y_min; y <= y_max; y++) {
				var tile = tiles.get(x, y);
				ctx.beginPath();
				ctx.fillStyle = tile.type;
				var tx = (tile.x * cellSize) - avatar.x;
				var ty = (tile.y * cellSize) - avatar.y;
				ctx.fillRect(tx, ty, cellSize, cellSize);
			}
		}

		ctx.beginPath();
		ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
		ctx.fillStyle = 'yellow';
		ctx.fill();

		ctx.restore();
		ctx.font = '16px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(status, 8, 20);
		ctx.fillStyle = 'yellow';
		ctx.fillText(status, 9, 21);
	}

	var pressed = {
		up: keyboard.bindCheckOf('w'),
		down: keyboard.bindCheckOf('s'),
		left: keyboard.bindCheckOf('a'),
		right: keyboard.bindCheckOf('d')
	};

	var speed = 3;
	var status = 'begin';

	function update() {

		if (pressed.up()) {
			avatar.y -= speed;
		}
		if (pressed.down()) {
			avatar.y += speed;
		}
		if (pressed.left()) {
			avatar.x -= speed;
		}
		if (pressed.right()) {
			avatar.x += speed;
		}

		status = tiles.get(avatar.x_(), avatar.y_()).type;

	}

	return {
		initialize: initialize,
		update: update,
		draw: draw
	};

});