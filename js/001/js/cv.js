/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = function() {
	this.dragging = false;
	this.dragItem = null;
	
	// get canvas's DOM element and context
	var $canvas = $('#cv1');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) {
		return false;
	}
	var ctx = $canvas[0].getContext("2d");
	
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;

	// display
	this.DRAG = new canvasManager(ctx, $canvas.attr('width'), $canvas.attr('height'));
	this.DRAG.draw();
	
	// set events to the canvas
	$canvas.mousedown(this.cvmsDown.bind(this));
	$canvas.mouseup(this.cvmsUp.bind(this));
	$canvas.mouseleave(this.cvmsUp.bind(this));
	$canvas.mousemove(this.cvmsMove.bind(this));
};

/* mousedown process
 * {event} evt: event obj
 * return: none
 */
panelApl.prototype.cvmsDown = function(evt) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canvasLeft;
		var cy = evt.pageY - this.canvasTop;
		// check if any object is at the point
		var itemIdx = this.DRAG.checkItem(cx, cy);
		if (itemIdx != null) {
			this.dragging = true;
			this.dragItem = itemIdx;
		}
	}
	return false;
};
/* mouseup/mouseleave process
 * {event} evt: event obj
 * return: none
 */
panelApl.prototype.cvmsUp = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canvasLeft;
		var cy = evt.pageY - this.canvasTop;
		if (cx < 0) cx = 0;
		if (cx > this.DRAG.area.w) cx = this.DRAG.area.w;
		if (cy < 0) cy = 0;
		if (cy > this.DRAG.area.h) cy = this.DRAG.area.h;
		// update canvas
		this.DRAG.draw();

		this.dragging = false;
		this.dragItem = null;
	}
};
/* mousemove process
 * {event} evt: evnet obj
 * return: none
 */
panelApl.prototype.cvmsMove = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canvasLeft;
		var cy = evt.pageY - this.canvasTop;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		if (Math.abs(cx - this.DRAG.itemAr[this.dragItem].x) >= updSep ||
			Math.abs(cy - this.DRAG.itemAr[this.dragItem].y) >= updSep) {
			// update the position of the item
			this.DRAG.itemAr[this.dragItem].x = cx;
			this.DRAG.itemAr[this.dragItem].y = cy;
			// update the canvas
			this.DRAG.draw();
		}
	}
	return false;
};

$(function() {
	var panel = new panelApl();
});
