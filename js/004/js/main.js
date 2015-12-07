var Apl = function() {
	this.dragging = false;
	
	// get canvas DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) {
		return false;
	}
	this.ctx = $canvas[0].getContext("2d");
	this.prevPos = {x: 0, y: 0};

	// resize canvas
	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', $canvas.height());

	// get canvas info
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = $canvas.attr('width')
	this.canvasHeight = $canvas.attr('height')

	// context settnigs
	this.ctx.globalCompositeOperation = "source-over";
	this.setColorBlack();
	this.setLineWidth1px();

	// set events to the canvas
	$canvas.bind('touchstart', this.hDown.bind(this));
	$canvas.bind('touchend', this.hUp.bind(this));
	$canvas.bind('touchmove', this.hMove.bind(this));
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));

    // set bottun events
    $('#color-black').bind('touchstart', this.setColorBlack.bind(this));
    $('#color-black').bind('mousedown', this.setColorBlack.bind(this));
    $('#color-red').bind('touchstart', this.setColorRed.bind(this));
    $('#color-red').bind('mousedown', this.setColorRed.bind(this));
    $('#color-blue').bind('touchstart', this.setColorBlue.bind(this));
    $('#color-blue').bind('mousedown', this.setColorBlue.bind(this));
    $('#color-yellow').bind('touchstart', this.setColorYellow.bind(this));
    $('#color-yellow').bind('mousedown', this.setColorYellow.bind(this));
    $('#line-1px').bind('touchstart', this.setLineWidth1px.bind(this));
    $('#line-1px').bind('mousedown', this.setLineWidth1px.bind(this));
    $('#line-3px').bind('touchstart', this.setLineWidth3px.bind(this));
    $('#line-3px').bind('mousedown', this.setLineWidth3px.bind(this));
    $('#line-5px').bind('touchstart', this.setLineWidth5px.bind(this));
    $('#line-5px').bind('mousedown', this.setLineWidth5px.bind(this));
	
	this._blank();
};
// color setting
Apl.prototype.setColor = function(color) {
    this.ctx.strokeStyle = color;
};
Apl.prototype.setColorBlack = function() {
    this.setColor('black');
};
Apl.prototype.setColorRed = function() {
    this.setColor('red');
};
Apl.prototype.setColorBlue = function() {
    this.setColor('blue');
};
Apl.prototype.setColorYellow = function() {
    this.setColor('yellow');
};
// line width setting
Apl.prototype.setLineWidth = function(lineWidth) {
	this.ctx.lineWidth = lineWidth;
};
Apl.prototype.setLineWidth1px = function() {
    this.setLineWidth(1);
};
Apl.prototype.setLineWidth3px = function() {
    this.setLineWidth(3);
};
Apl.prototype.setLineWidth5px = function() {
    this.setLineWidth(5);
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
Apl.prototype.getCanvasPosition = function(e) {
	if (e.originalEvent.touches != undefined) {
		return {x: parseInt(e.originalEvent.touches[0].pageX - this.canvasLeft),
				y: parseInt(e.originalEvent.touches[0].pageY - this.canvasTop)};
	} else {
		return {x: parseInt(e.pageX - this.canvasLeft),
				y: parseInt(e.pageY - this.canvasTop)};
	}
}
Apl.prototype.setPos = function(p) {
    this.prevPos = p;
};
Apl.prototype.draw = function(p) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevPos.x, this.prevPos.y);
    this.ctx.lineTo(p.x, p.y);
    this.ctx.stroke();
    this.prevPos = p;
};
Apl.prototype.hDown = function(e) {
	if (!this.dragging) {
		// convert coordinate from point to canvas
		var p = this.getCanvasPosition(e);
		this.setPos(p);
		// check if any object is at the point
		this.dragging = true;
	}
	e.preventDefault();
};
Apl.prototype.hUp = function(e) {
	if (this.dragging) {
		this.dragging = false;
	}
	e.preventDefault();
};
Apl.prototype.hMove = function(e) {
	if (this.dragging) {
		// convert coordinate from point to canvas
		var p = this.getCanvasPosition(e);
		// check if the canvas should be updated
		if (p.x != this.prevPos.x || p.y != this.prevPos.y) {
			this.draw(p);
		}
	}
	e.preventDefault();
};

$(function() {
	var apl = new Apl();
});
