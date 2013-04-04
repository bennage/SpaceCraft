define(function(require) {

	var randomBetween = require('randomBetween');
	var floor = require('tiles/station-floor');
	var dome = require('building/dome');

	var rooms = [];

	var max_size = 48;
	var min_size = 12;

	// the overall width and height that comes close to
	// acheiving the desire area
	var width = randomBetween(min_size, max_size);
	var height = randomBetween(min_size, max_size);

	rooms[0] = {
		left: 0,
		right: width,
		top: 0,
		bottom: height
	};

	var count = 8;

	function getNode() {
		var largeRooms = [];
		var room;
		for (var l = rooms.length - 1; l >= 0; l--) {
			room = rooms[l];

			if (room.right - room.left > 5 || room.bottom - room.top > 5) {
				largeRooms.push(room);
			}
		}
		var index = randomBetween(0, largeRooms.length - 1);
		return largeRooms[index];
	}

	for (var i = 0; i < count; i++) {
		var old_node = getNode();
		if (!old_node) break;
		var new_nodes = splitInTwo(old_node);
		if (new_nodes.length === 0) break;
		var index = rooms.indexOf(old_node);
		rooms.splice(index, 1, new_nodes[0], new_nodes[1]);
	}

	function splitInTwo(node) {

		var split_options = [];

		if (node.right - node.left > 5) {
			split_options.push(splitVertical);
		}

		if (node.bottom - node.top > 5) {
			split_options.push(splitHorizontal);
		}

		if (split_options.length === 0) {
			debugger;
			return [];
		}

		var index = randomBetween(0, split_options.length - 1);
		console.log('choosing ' + index);
		return split_options[index](node);
	}

	function splitVertical(node) {
		var splitAt = randomBetween(node.left + 2, node.right - 3);
		console.log('split v @ x ' + splitAt);
		return [{
			left: node.left,
			right: splitAt,
			top: node.top,
			bottom: node.bottom
		}, {
			left: splitAt + 1,
			right: node.right,
			top: node.top,
			bottom: node.bottom
		}];
	}

	function splitHorizontal(node) {
		var splitAt = randomBetween(node.top + 2, node.bottom - 3);
		console.log('split h @ y ' + splitAt);

		return [{
			left: node.left,
			right: node.right,
			top: node.top,
			bottom: splitAt
		}, {
			left: node.left,
			right: node.right,
			top: splitAt + 1,
			bottom: node.bottom
		}];
	}

	return function(knownSpace) {
		var room;
		var x, y;

		function createFloorIn(x1, y1) {
			knownSpace[x1] = knownSpace[x1] || {};
			knownSpace[x1][y1] = floor(x1, y1);
		}

		console.log(rooms.length + ' rooms');

		for (var i = 0; i < rooms.length; i++) {
			room = rooms[i];
			// console.log(room.top + ' ' + room.bottom + ' ' + room.left + ' ' + room.right);
			var should_dome = (randomBetween(1, 3) > 2);
			if (room.right - room.left > 6 && room.bottom - room.top > 6) {
				dome(knownSpace, room.left, room.top, room.right - room.left, room.bottom - room.top);
			} else {
				for (x = room.left; x <= room.right; x++) {
					createFloorIn(x, room.top);
					createFloorIn(x, room.bottom);
				}
				for (y = room.top; y <= room.bottom; y++) {
					createFloorIn(room.left, y);
					createFloorIn(room.right, y);
				}
			}
		}
	};

});