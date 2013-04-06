(function() {

	require({
		urlArgs: "b=" + ((new Date()).getTime()),
		paths: {
			jquery: 'vendor/jquery'
		}
	}, ['jquery', 'game', 'input/keyboard', 'resolution', 'shims/requestAnimationFrame'],

	function($, game, keyboard, resolution) {

		$(function() {

			var ctx;
			var frameId = 0;
			var lastFrame = Date.now();
			var thisFrame = Date.now();
			var elapsed = 0;

			var canvas = document.createElement('canvas');
			canvas.setAttribute('width', resolution.width);
			canvas.setAttribute('height', resolution.height);
			document.body.appendChild(canvas);

			function loop() {

				thisFrame = Date.now();

				elapsed = thisFrame - lastFrame;

				frameId = requestAnimationFrame(loop);

				game.update(elapsed);
				game.draw(ctx);

				lastFrame = thisFrame;
			}

			function start() {
				ctx = canvas.getContext('2d');
				keyboard.listen(document.body);
				game.initialize(loop);
			}

			start();
		});
	});

}).call(this);