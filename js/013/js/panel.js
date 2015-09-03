var panelApl = function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// init canvas
	this.canv = new canvasManager(ctx, canvas.width, canvas.height);
	this.canv.draw();

	// start timer
	this.timer = $.timer();
	this.timer.set({
		action: function() {
			this.count ++;
			this.canv.moveObj();
			this.canv.draw();
		}.bind(this),
		time: 40
	});
	this.timer.play();
};

$(function() {
	var apl = new panelApl();
});
