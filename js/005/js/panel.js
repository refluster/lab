var panelApl = {}; // namespace

$(function() {
    panelApl.timer = $.timer();

	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
	
	// display
	panelApl.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
	panelApl.canv.draw();
	
    panelApl.timer.set({
        action: function() {
            panelApl.canv.moveObj();
            panelApl.canv.draw();
        },
        time: 15
    });
	
	panelApl.timer.play();
});
