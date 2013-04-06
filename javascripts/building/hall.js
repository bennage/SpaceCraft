define(function(require) {

	var wall = require('tiles/station-wall');
	var floor = require('tiles/station-floor');
	var door = require('tiles/door');

	var min_length = 2;
	var max_length = 12;

	function createAt(knownSpace, build, x, y) {
		knownSpace[x] = knownSpace[x] || {};
		knownSpace[x][y] = build(x, y);
	}

	return function(knownSpace, ox, oy, direction) {

		direction = 0;

		var wallAt = createAt.bind(null, knownSpace, wall);
		var floorAt = createAt.bind(null, knownSpace, floor);

		var length = Math.floor(Math.random() * (max_length - min_length)) + min_length;
		var x0 = Math.cos(direction);
		var y0 = Math.sin(direction);
		var x, y;

		for (var i = 0; i < length; i++) {
			x = i * x0 + ox;
			y = i * y0 + oy;

			floorAt(x, y);
			wallAt(x, y - 1);
			wallAt(x, y + 1);
		}
	};
});