define(function(require) {

	var BinaryTree = require('btree');
	var randomBetween = require('randomBetween');
	var floor = require('tiles/station-floor');
	var dome = require('building/dome');

	var max_size = 64;
	var min_size = 12;

	// the overall width and height that comes close to
	// acheiving the desire area
	var width = randomBetween(min_size, max_size);
	var height = randomBetween(min_size, max_size);

	var roomTree = new BinaryTree({
		left: 0,
		right: width,
		top: 0,
		bottom: height
	});

	function build() {

		function chance() {
			return randomBetween(0, 1) > 0.4;
		}

		function construct(current) {
			var splits = splitInTwo(current.item);

			if (splits[0]) {
				current.addLeft(splits[0]);
				if (chance()) construct(current.left);
			}

			if (splits[1]) {
				current.addRight(splits[1]);
				if (chance()) construct(current.right);
			}
		}

		construct(roomTree);
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

		build();
		var rooms = roomTree.leaves();

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