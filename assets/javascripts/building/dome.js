define(function(require) {



	var wall = require('tiles/station-wall');
	var floor = require('tiles/station-floor');
	// var door = require('tiles/door');

	// var hall = require('building/hall');

	var min_radius = 3;
	var max_radius = 8;
	// var doors = [1, 4];

	function createWallIn(knownSpace, x, y) {
		knownSpace[x] = knownSpace[x] || {};
		knownSpace[x][y] = wall(x, y);
	}

	function createFloorIn(knownSpace, x, y) {
		knownSpace[x] = knownSpace[x] || {};
		knownSpace[x][y] = floor(x, y);
	}

	function getAdjacentTiles(knownSpace, x, y) {
		var adjacent = [];
		var ax, ay, row;

		for (ax = x - 1; ax < x + 2; ax++) {
			row = knownSpace[ax];
			if (!row) continue;
			for (ay = y - 1; ay < y + 2; ay++) {
				if (ax === x && ay === y) continue;
				if (row[ay]) adjacent.push(row[ay]);
			}
		}

		return adjacent;
	}

	function adjustSprites(knownSpace, bounds) {
		var x, y, adjacent, tile;
		for (x = bounds.x_min; x <= bounds.x_max; x++) {
			for (y = bounds.y_min; y <= bounds.y_max; y++) {
				var tile = (knownSpace[x] || {})[y] || {};

				if (tile.adjustSprite) {
					adjacent = getAdjacentTiles(knownSpace, x, y);
					tile.adjustSprite(adjacent || []);
				}
			}
		}
	}

	// note: this alogorithm ineffeciently overwrites 
	// previously created tiles.
	return function(knownSpace, left, top, width, height) {
		var wallAt = createWallIn.bind(null, knownSpace);
		var floorAt = createFloorIn.bind(null, knownSpace);

		max_radius = Math.floor(Math.min(width, height) / 2);
		if (min_radius > max_radius) min_radius = max_radius;

		// determine desire size
		var radius = Math.floor(Math.random() * (max_radius - min_radius)) + min_radius;

		// center the origin inside the allocated space
		var x_offset = Math.floor((width - radius * 2) / 2);
		var y_offset = Math.floor((height - radius * 2) / 2);

		var ox = left + radius + x_offset;
		var oy = top + radius + y_offset;

		var x_min = left;
		var x_max = left + 2 * radius;
		var y_min = top;
		var y_max = top + 2 * radius;

		// determine if space is available
		// x if not, reduce size
		// x if not, report failure

		//floor
		for (y = -radius; y <= radius; y++)
		for (x = -radius; x <= radius; x++)
		if ((x * x) + (y * y) <= (radius * radius)) {
			floorAt(x + ox, y + oy);
		}

		//wall
		// circle outline based on
		// http://en.wikipedia.org/wiki/Midpoint_circle_algorithm
		var x = radius;
		var y = 0;

		var xChange = 1 - (radius << 1);
		var yChange = 0;
		var radiusError = 0;

		while (x >= y) {
			wallAt(x + ox, y + oy);
			wallAt(y + ox, x + oy);
			wallAt(-x + ox, y + oy);
			wallAt(-y + ox, x + oy);
			wallAt(-x + ox, -y + oy);
			wallAt(-y + ox, -x + oy);
			wallAt(x + ox, -y + oy);
			wallAt(y + ox, -x + oy);

			y++;
			radiusError += yChange;
			yChange += 2;
			if (((radiusError << 1) + xChange) > 0) {
				x--;
				radiusError += xChange;
				xChange += 2;
			}
		}

		// // create doors
		// var door_count = (Math.random() * (doors[1] - doors[0])) + doors[1];
		// for (var i = 0; i < door_count; i++) {
		// 	knownSpace[radius][-1] = wall(radius, -1);
		// 	knownSpace[radius][0] = door(radius, 0);
		// 	knownSpace[radius][1] = wall(radius, 1);
		// }

		// hall(knownSpace, radius + 1, 0, Math.PI / 2);


		// // adjust sprites
		// adjustSprites(knownSpace, {
		// 	x_min: x_min,
		// 	x_max: x_max + 12,
		// 	y_min: y_min,
		// 	y_max: y_max
		// });
	};
});