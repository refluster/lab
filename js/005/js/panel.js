var Apl = function() {
    this.timer = $.timer();
	
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
	
	this.canv = new canvasManager(ctx, canvas.width, canvas.height, this);
	this.canv.draw();
	
    this.timer.set({
        action: function() {
            this.canv.moveObj();
            this.canv.draw();
        }.bind(this),
        time: 15
    });
	
	this.timer.play();
};

$(function() {
	apl = new Apl();
});
