define(function(require) {

	var wall = require('tiles/station-wall');
	var floor = require('tiles/station-floor');
	var door = require('tiles/door');

	var hall = require('building/hall');

	var min_radius = 3;
	var max_radius = 8;
	var doors = [1, 4];

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
	return function(knownSpace, ox, oy) {
		var wallAt = createWallIn.bind(null, knownSpace);
		var floorAt = createFloorIn.bind(null, knownSpace);

		// determine desire size
		var radius = Math.floor(Math.random() * (max_radius - min_radius)) + min_radius;
		var x_min = ox - radius;
		var x_max = ox + radius;
		var y_min = oy - radius;
		var y_max = oy + radius;

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

		// create doors
		var door_count = (Math.random() * (doors[1] - doors[0])) + doors[1];
		for (var i = 0; i < door_count; i++) {
			knownSpace[radius][-1] = wall(radius, -1);
			knownSpace[radius][0] = door(radius, 0);
			knownSpace[radius][1] = wall(radius, 1);
		}

		hall(knownSpace, radius + 1, 0, Math.PI / 2);


		// adjust sprites
		adjustSprites(knownSpace, {
			x_min: x_min,
			x_max: x_max + 12,
			y_min: y_min,
			y_max: y_max
		});
	};
});