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
	this.ctx = $canvas[0].getContext("2d");
	
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = $canvas.attr('width')
	this.canvasHeight = $canvas.attr('height')

	this.grSep = 30;  // grid interval(px)

	// context settnigs
	this.ctx.strokeStyle = "#000";
	this.ctx.lineWidth = 1;
	this.ctx.globalAlpha = 0.7;
	this.ctx.globalCompositeOperation = "source-over";

	// initial position of items
	this.itemAr = []; // items
	this.itemAr[0] = {x: this.grSep/2, y: this.grSep/2, type: 'circle'};
	this.itemAr[1] = {x: this.grSep/2, y: this.grSep/2 + this.grSep, type: 'triangle'};
	this.itemAr[2] = {x: this.grSep/2, y: this.grSep/2 + this.grSep*2, type: 'square'};

	// display
	//	this.DRAG = new canvasManager(ctx, this.canvasWidth, this.canvasHeight);
	//	this.DRAG.draw();
	this.draw();
	
	// set events to the canvas
	$canvas.mousedown(this.cvmsDown.bind(this));
	$canvas.mouseup(this.cvmsUp.bind(this));
	$canvas.mouseleave(this.cvmsUp.bind(this));
	$canvas.mousemove(this.cvmsMove.bind(this));
};

//////////////////////////////

panelApl.prototype._blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

	for (var x = 0; x < this.canvasWidth; x += this.grSep) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.canvasHeight);
		this.ctx.stroke();
	}

	for (var y = 0; y < this.canvasHeight; y += this.grSep) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, y);
		this.ctx.lineTo(this.canvasWidth, y);
		this.ctx.stroke();
	}
};

panelApl.prototype.draw = function() {
	// init canvas
	this._blank();
	// draw items
	for (var i = 0; i < this.itemAr.length; i++) {
		switch (this.itemAr[i].type) {
		case 'circle':
			this.drawCircle(this.itemAr[i].x, this.itemAr[i].y);
			break;
		case 'triangle':
			this.drawTriangle(this.itemAr[i].x, this.itemAr[i].y);
			break;
		case 'square':
			this.drawSquare(this.itemAr[i].x, this.itemAr[i].y);
			break;
		default:
			this.drawCircle(this.itemAr[i].x, this.itemAr[i].y);
			break;
		}
	}
};

panelApl.prototype.drawCircle = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'green';
	this.ctx.beginPath();
	this.ctx.arc(x, y, this.grSep/2, 0, Math.PI*2, false);
	this.ctx.fill();
	this.ctx.restore();
};

panelApl.prototype.drawTriangle = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'blue';
	this.ctx.beginPath();
	this.ctx.moveTo(x, y - this.grSep/2);
	this.ctx.lineTo(x - this.grSep/2, y + this.grSep/2);
	this.ctx.lineTo(x + this.grSep/2, y + this.grSep/2);
	this.ctx.closePath();
	this.ctx.fill();
	this.ctx.restore();
};

panelApl.prototype.drawSquare = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'purple';
	this.ctx.fillRect(x - this.grSep/2, y - this.grSep/2,
					  this.grSep, this.grSep);
	this.ctx.restore();
};

panelApl.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.itemAr.length; i++) {
		if (x >= this.itemAr[i].x - this.grSep/2 &&
			x <= this.itemAr[i].x + this.grSep/2 &&
			y >= this.itemAr[i].y - this.grSep/2 &&
			y <= this.itemAr[i].y + this.grSep/2) {
			return i;
		}
	}
	return null;
};

//////////////////////////////

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
		var itemIdx = this.checkItem(cx, cy);
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
		if (cx > this.canvasWidth) cx = this.canvasWidth;
		if (cy < 0) cy = 0;
		if (cy > this.canvasHeight) cy = this.canvasHeight;
		// update canvas
		this.draw();

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
		if (Math.abs(cx - this.itemAr[this.dragItem].x) >= updSep ||
			Math.abs(cy - this.itemAr[this.dragItem].y) >= updSep) {
			// update the position of the item
			this.itemAr[this.dragItem].x = cx;
			this.itemAr[this.dragItem].y = cy;
			// update the canvas
			this.draw();
		}
	}
	return false;
};

$(function() {
	var panel = new panelApl();
});
