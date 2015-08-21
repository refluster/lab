var Apl = function() {
	/* global var */
	// drag state
	this.dragging = false;

	// get canvas's DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	var ctx = $canvas[0].getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
	
    // get canvas info
    this.canvasLeft = $canvas.offset().left;
    this.canvasTop = $canvas.offset().top;
    this.canvasWidth = $canvas.attr('width')
    this.canvasHeight = $canvas.attr('height')
	
	// display
	this.canv = new canvasManager(ctx, $canvas[0].width, $canvas[0].height, this);
	this.canv.draw();
	
	// timer
	this.timer = $.timer();
	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.setSpeedMovedObj();
			this.canv.draw();
		}.bind(this),
		time: 40
	});

	// add mouse events to the canvas
	$canvas.mousedown(this.cvmsDown.bind(this));
	$canvas.mouseup(this.cvmsUp.bind(this));
	$canvas.mouseleave(this.cvmsUp.bind(this));
	$canvas.mousemove(this.cvmsMove.bind(this));
	// add touch events to the canvas
	$canvas.bind("touchstart", this.cvmsDown.bind(this));
	$canvas.bind("touchend", this.cvmsUp.bind(this));
	$canvas.bind("touchend", this.cvmsUp.bind(this));
	$canvas.bind("touchmove", this.cvmsMove.bind(this));

	// start timer
	this.timer.play();
};

Apl.prototype.getCanvasPosition = function(e) {
    if (e.originalEvent.touches != undefined && e.originalEvent.touches.length > 0) {
        return {x: parseInt(e.originalEvent.touches[0].pageX - this.canvasLeft),
                y: parseInt(e.originalEvent.touches[0].pageY - this.canvasTop)};
    } else {
        return {x: parseInt(e.pageX - this.canvasLeft),
                y: parseInt(e.pageY - this.canvasTop)};
    }
};

Apl.prototype.cvmsDown = function(e) {
    var p = this.getCanvasPosition(e);
	this.dragging = true;
	this.canv.holdAt(p);
	return false;
};

Apl.prototype.cvmsUp = function(e) {
	if (this.dragging) {
		var p = this.getCanvasPosition(e);
		if (p.x < 0) p.x = 0;
		if (p.x > this.canv.area.w) p.x = this.canv.area.w;
		if (p.y < 0) p.y = 0;
		if (p.y > this.canv.area.h) p.y = this.canv.area.h;

		this.dragging = false;
		this.canv.releaseAt(p);
	}
};

Apl.prototype.cvmsMove = function(e) {
	if (this.dragging) {
		var p = this.getCanvasPosition(e);
		this.canv.moveTo(p);
	}
	return false;
};

$(function() {
	apl = new Apl();
});
