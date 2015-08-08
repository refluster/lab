/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

/* global var */
// drag state
panelApl.drag = {
	now: false, // true if dragging
	item: null  // index of itemAr of dragging item
};
panelApl.gamestart = false;  // true if playing

/* button process
 * return: none
 */
panelApl.start = function() {
	var $cvdiv = $('#cvdiv1');
	// set events to the canvas
	$cvdiv.mousedown(panelApl.cvmsDown);
	$cvdiv.mouseup(panelApl.cvmsUp);
	$cvdiv.mouseleave(panelApl.cvmsUp);
	$cvdiv.mousemove(panelApl.cvmsMove);
	// init canvas
	panelApl.DRAG.init();
	panelApl.DRAG.draw();
	
	panelApl.gamestart = true;
};

/* mousedown process
 * {event} evt: event obj
 * return: none
 */
panelApl.cvmsDown = function(evt) {
	if (!panelApl.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.DRAG.cvpos.x;
		var cy = evt.pageY - panelApl.DRAG.cvpos.y;
		// check if any object is at the point
		var itemIdx = panelApl.DRAG.checkItem(cx, cy);
		if (itemIdx != null) {
			panelApl.drag.now = true;
			panelApl.drag.item = itemIdx;
		}
	}
	return false;
};
/* mouseup/mouseleave process
 * {event} evt: event obj
 * return: none
 */
panelApl.cvmsUp = function(evt) {
	if (panelApl.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.DRAG.cvpos.x;
		var cy = evt.pageY - panelApl.DRAG.cvpos.y;
		if (cx < 0) cx = 0;
		if (cx > panelApl.DRAG.area.w) cx = panelApl.DRAG.area.w;
		if (cy < 0) cy = 0;
		if (cy > panelApl.DRAG.area.h) cy = panelApl.DRAG.area.h;
		// set item position to the center of the grid
		//panelApl.DRAG.setCenter(panelApl.drag.item, cx, cy);
		// update canvas
		panelApl.DRAG.draw();

		panelApl.drag.now = false;
		panelApl.drag.item = null;
	}
};
/* mousemove process
 * {event} evt: evnet obj
 * return: none
 */
panelApl.cvmsMove = function(evt) {
	if (panelApl.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.DRAG.cvpos.x;
		var cy = evt.pageY - panelApl.DRAG.cvpos.y;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		if (Math.abs(cx - panelApl.DRAG.itemAr[panelApl.drag.item].x) >= updSep ||
			Math.abs(cy - panelApl.DRAG.itemAr[panelApl.drag.item].y) >= updSep) {
			// update the position of the item
			panelApl.DRAG.itemAr[panelApl.drag.item].x = cx;
			panelApl.DRAG.itemAr[panelApl.drag.item].y = cy;
			// update the canvas
			panelApl.DRAG.draw();
		}
	}
	return false;
};

$(function() {
	// get canvas's DOM element and context
	var canvas = $('#cv1')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalAlpha = 0.7;
	ctx.globalCompositeOperation = "source-over";
	
	// display
	panelApl.DRAG = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
	panelApl.DRAG.init();
	panelApl.DRAG.draw();
	
	panelApl.start();
});
