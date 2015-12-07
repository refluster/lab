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
	ctx.fillStyle = '#FF5722';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2, false);
	ctx.fill();
};
Item.prototype._drawTriangle = function(ctx) {
	ctx.fillStyle = '#1E88E5';
	ctx.beginPath();
	ctx.moveTo(this.x, this.y - this.size/2);
	ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
	ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
	ctx.closePath();
	ctx.fill();
};
Item.prototype._drawSquare = function(ctx) {
	ctx.fillStyle = '#FFEB3B';
	ctx.fillRect(this.x - this.size/2, this.y - this.size/2,
				 this.size, this.size);
};
Item.prototype.isInternal = function(x, y) {
	if (x >= this.x - this.size/2 &&
		x <= this.x + this.size/2 &&
		y >= this.y - this.size/2 &&
		y <= this.y + this.size/2) {
		return true;
	}
	return false;
}

var Apl = function() {
	this.dragging = false;
	this.dragItem = null;
	this.gridWidth = 80;
	
	// get canvas DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) {
		return false;
	}
	this.ctx = $canvas[0].getContext("2d");

	// resize canvas
	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', $canvas.height());

	// get canvas info
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = $canvas.attr('width')
	this.canvasHeight = $canvas.attr('height')

	// context settnigs
	this.ctx.strokeStyle = "#888";
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	// create items
	this.item = [];
	this.item.push(new Item(Item.CIRCLE, this.gridWidth));
	this.item.push(new Item(Item.TRIANGLE, this.gridWidth));
	this.item.push(new Item(Item.SQUARE, this.gridWidth));
	for (var i = 0; i < this.item.length; i++) {
		// initialize position randomely in the canvas
		var x = parseInt(Math.random()*(this.canvasWidth - this.gridWidth) + this.gridWidth/2);
		var y = parseInt(Math.random()*(this.canvasHeight - this.gridWidth) + this.gridWidth/2);
		this.item[i].setPosition(x, y);
	}

	// set events to the canvas
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mouseleave(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));

	this.draw();
};
Apl.prototype._blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

	for (var x = 0; x < this.canvasWidth; x += this.gridWidth) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.canvasHeight);
		this.ctx.stroke();
	}

	for (var y = 0; y < this.canvasHeight; y += this.gridWidth) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, y);
		this.ctx.lineTo(this.canvasWidth, y);
		this.ctx.stroke();
	}
};
Apl.prototype.draw = function() {
	this._blank();
	this.ctx.save();
	for (var i = 0; i < this.item.length; i++) {
		this.item[i].draw(this.ctx);
	}
	this.ctx.restore();
};
Apl.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.item.length; i++) {
		if (this.item[i].isInternal(x, y)) {
			return i;
		}
	}
	return null;
};
Apl.prototype.hDown = function(evt) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		// check if any object is at the point
		var itemIdx = this.checkItem(x, y);
		if (itemIdx != null) {
			this.dragging = true;
			this.dragItem = itemIdx;
		}
	}
};
Apl.prototype.hUp = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		if (x < 0) x = 0;
		if (x > this.canvasWidth) x = this.canvasWidth;
		if (y < 0) y = 0;
		if (y > this.canvasHeight) y = this.canvasHeight;
		// update canvas
		this.draw();

		this.dragging = false;
		this.dragItem = null;
	}
};
Apl.prototype.hMove = function(evt) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var x = parseInt(evt.pageX - this.canvasLeft);
		var y = parseInt(evt.pageY - this.canvasTop);
		// check if the canvas should be updated
		if (x != this.item[this.dragItem].x ||
			y != this.item[this.dragItem].y) {
			this.item[this.dragItem].setPosition(x, y);
			this.draw();
		}
	}
};

$(function() {
	var apl = new Apl();
});
