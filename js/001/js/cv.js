var Item = function(type, size) {
	this.x = 0;
	this.y = 0;
	this.type = type;
	this.size = size;
	switch (this.type) {
	case Item.CIRCLE:
		this.draw = this._drawCircle;
		break;
	case Item.TRIANGLE:
		this.draw = this._drawTriangle;
		break;
	case Item.SQUARE:
		this.draw = this._drawSquare;
		break;
	default:
		this.draw = this._drawCircle;
		break;
	}
};
Item.CIRCLE = 0;
Item.TRIANGLE = 1;
Item.SQUARE = 2;
Item.prototype.setPosition = function(x, y) {
	this.x = x; this.y = y;
};
Item.prototype._drawCircle = function(ctx) {
	ctx.save();
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2, false);
	ctx.fill();
	ctx.restore();
};
Item.prototype._drawTriangle = function(ctx) {
	ctx.save();
	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(this.x, this.y - this.size/2);
	ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
	ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
};
Item.prototype._drawSquare = function(ctx) {
	ctx.save();
	ctx.fillStyle = 'purple';
	ctx.fillRect(this.x - this.size/2, this.y - this.size/2,
				 this.size, this.size);
	ctx.restore();
};

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
	this.itemAr.push(new Item(Item.CIRCLE, this.grSep));
	this.itemAr.push(new Item(Item.TRIANGLE, this.grSep));
	this.itemAr.push(new Item(Item.SQUARE, this.grSep));
	for (var i = 0; i < this.itemAr.length; i++) {
		this.itemAr[i].setPosition(this.grSep/2, this.grSep/2 + this.grSep*i);
	}

	this.draw();
	
	// set events to the canvas
	$canvas.mousedown(this.cvmsDown.bind(this));
	$canvas.mouseup(this.cvmsUp.bind(this));
	$canvas.mouseleave(this.cvmsUp.bind(this));
	$canvas.mousemove(this.cvmsMove.bind(this));
};

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
	for (var i = 0; i < this.itemAr.length; i++) {
		this.itemAr[i].draw(this.ctx);
	}
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
