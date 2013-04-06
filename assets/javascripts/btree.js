define(function() {

	var Node = function(item, parent) {
		this.item = item;
		this.parent = parent;
	};

	Node.prototype.addLeft = function(item) {
		this.left = new Node(item, this);
	};

	Node.prototype.addRight = function(item) {
		this.right = new Node(item, this);
	};

	Node.prototype.leaves = function() {
		var descendents = [];

		if (!this.right && !this.left) {
			descendents.push(this.item);
		} else {
			if (this.right) descendents = descendents.concat(this.right.leaves());
			if (this.left) descendents = descendents.concat(this.left.leaves());
		}

		return descendents;
	};

	return Node;
});