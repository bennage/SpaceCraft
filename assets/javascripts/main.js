(function() {

	require({
		urlArgs: "b=" + ((new Date()).getTime()),
		paths: {
			jquery: 'vendor/jquery'
		}
	}, ['jquery', 'app', 'shims/requestAnimationFrame'], function($, app) {
		$(function() {
			var canvas = document.createElement('canvas');
			canvas.setAttribute('width', 600);
			canvas.setAttribute('height', 400);
			document.body.appendChild(canvas);

			app.start(canvas);
		});
	});

}).call(this);