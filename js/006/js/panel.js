/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = function() {
	/* global var */
	// drag state
	this.dragging = false;

	// timer
	this.timer = $.timer();
	
	// get canvas's DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	var ctx = $canvas[0].getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
	
	// display
	this.canv = new canvasManager.canv(ctx, $canvas[0].width, $canvas[0].height, this);
	this.canv.init();
	this.canv.draw();
	
	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.setSpeedMovedObj();
			this.canv.draw();
		}.bind(this),
		time: 40
	});

	this.start();
};

/* button process
 * return: none
 */
panelApl.prototype.start = function() {
	var $canvas = $('#canvas'); // main Canvas¤Îdiv

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

	// init canvas
	this.canv.init();

	// start timer
	this.timer.play();
};

/* mousedown process
 * {event} evt: event obj
 * return: none
 */
panelApl.prototype.cvmsDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - this.canv.cvpos.x;
	var cy = evt.pageY - this.canv.cvpos.y;
	this.dragging = true;
	this.canv.holdAt({x:cx, y:cy});
	return false;
};
/* mouseup/mouseleave process
 * {event} evt: event obj
 * return: none
 */
panelApl.prototype.cvmsUp = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		if (cx < 0) cx = 0;
		if (cx > this.canv.area.w) cx = this.canv.area.w;
		if (cy < 0) cy = 0;
		if (cy > this.canv.area.h) cy = this.canv.area.h;

		this.dragging = false;
		this.canv.releaseAt({x:cx, y:cy});
	}
};
/* mousemove process
 * {event} evt: evnet obj
 * return: none
 */
panelApl.prototype.cvmsMove = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		// update the canvas
		this.canv.moveTo({x:cx, y:cy});
	}
	return false;
};

$(function() {
	apl = new panelApl();
});
