var panelApl = function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.globalCompositeOperation = "source-over";
	
	// display
	this.canv = new canvasManager(ctx, canvas.width, canvas.height, this);
	this.canv.init();
	this.canv.draw();
};

$(function() {
    var apl = new panelApl();
});
