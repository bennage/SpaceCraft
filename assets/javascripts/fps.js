define(function(require) {

    var x = 500;
    var y = 20;

    var frames = 0;
    var ms = 0;
    var fps = 0;

    return {
        draw: function(ctx) {
            var message = fps + ' fps';
            ctx.font = '18px sans-serif';
            ctx.fillStyle = 'black';
            ctx.fillText(message, x, y);
            ctx.fillStyle = 'yellow';
            ctx.fillText(message, x + 1, y + 1);
        },

        update: function(elapsed) {
            frames++;
            ms += elapsed;
            if (ms > 1000) {
                fps = Math.round(frames * 1000 / ms);
                ms = 0;
                frames = 0;
            }
        }
    }
});