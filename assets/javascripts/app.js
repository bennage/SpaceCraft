define(function(require) {

	var surface, ctx;
	var game = require('game');
	var keyboard = require('input/keyboard');

	function start(canvas) {
		surface = canvas;
		ctx = surface.getContext('2d');
		keyboard.listen(document.body);
		game.initialize(loop);
	}

	function loop() {

		game.update();
		game.draw(ctx);

		requestAnimationFrame(loop);
	}

	return {
		start: start
	}
});