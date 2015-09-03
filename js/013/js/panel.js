/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = function() {
	/* global var */
	// drag state
	this.drag = {
		now: false, // true if dragging
	};
	this.gamestart = false;  // true if playing

	// timer
	this.timer = $.timer();

	/* body onload process */

	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// display
	this.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, this);
	//	this.canv.init();
	this.canv.draw();

	this.timer.set({
		action: function() {
			this.count ++;
			//                if (this.count  > 500) {
			//                    this.timer.pause();
			//                }
			this.canv.moveObj();
			this.canv.draw();
		}.bind(this),
		time: 40
	});
	//        this.timer.play();

	this.start();
};

panelApl.prototype.start = function() {
	var $canvas = $('#canvas'); // main Canvas¤Îdiv

	// add mouse events to the canvas
	$canvas.mousedown(this.cvmsDown);
	$canvas.mouseup(this.cvmsUp);
	$canvas.mouseleave(this.cvmsUp);
	$canvas.mousemove(this.cvmsMove);
	// add touch events to the canvas
	$canvas.bind("touchstart", this.cvmsDown);
	$canvas.bind("touchend", this.cvmsUp);
	$canvas.bind("touchend", this.cvmsUp);
	$canvas.bind("touchmove", this.cvmsMove);

	// init canvas
	this.canv.init();

	this.gamestart = true;
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
	this.drag.now = true;
	return false;
};
/* mouseup/mouseleave process
 * {event} evt: event obj
 * return: none
 */
panelApl.prototype.cvmsUp = function(evt) {
	if (this.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		if (cx < 0) cx = 0;
		if (cx > this.canv.area.w) cx = this.canv.area.w;
		if (cy < 0) cy = 0;
		if (cy > this.canv.area.h) cy = this.canv.area.h;

		this.drag.now = false;
	}
};
/* mousemove process
 * {event} evt: evnet obj
 * return: none
 */
panelApl.prototype.cvmsMove = function(evt) {
	if (this.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		// update the canvas
		//	    this.canv.draw({x:cx, y:cy});
	}
	return false;
};

$(function() {
	var apl = new panelApl();
});
