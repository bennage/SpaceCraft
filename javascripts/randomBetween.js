define(function() {
	return function(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
	};
});