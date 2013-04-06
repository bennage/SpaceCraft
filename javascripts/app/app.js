define(function(require) {

	var surface, ctx,
	game = require('game');

	function start(canvas) {
		surface = canvas;
		ctx = surface.getContext('2d');
		loop();
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