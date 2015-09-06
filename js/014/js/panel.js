var panelApl = function() {
	this.dragging = false;
	this.timer = $.timer();

	var $canvas = $('canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";
	
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	
	this.effectiveRadius = 30;

	this.prevCursorPos = {x:0, y:0};
	this.cursorPos = {x:0, y:0};

	this.glass = [];
	this.glassColor = 'black';
	this.glassLength = 10;
	this.glassBack = 2;

	for (var i = 0; i < 40; i++) {
		for (var j = 0; j < 40; j++) {
			this.glass[i*40+j] = {
				pos: {x:i*5, y:j*5},
				posHead: {x:i*5, y:j*5}
			};
		}
	}

	// add mouse events to the canvas
	$canvas.mousedown(this.hDown.bind(this));
	$canvas.mouseup(this.hUp.bind(this));
	$canvas.mouseleave(this.hUp.bind(this));
	$canvas.mousemove(this.hMove.bind(this));
	// add touch events to the canvas
	$canvas.bind("touchstart", this.hDown.bind(this));
	$canvas.bind("touchend", this.hUp.bind(this));
	$canvas.bind("touchend", this.hUp.bind(this));
	$canvas.bind("touchmove", this.hMove.bind(this));

	// timer
	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
			
			if (!this.needToUpdate()) {
				this.timer.pause();
			}
		}.bind(this),
		time: 60
	});
	this.timer.play();
};

panelApl.prototype.hDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - this.canvasLeft;
	var cy = evt.pageY - this.canvasTop;
	this.dragging = true;
	return false;
};
panelApl.prototype.hUp = function(evt) {
	if (this.dragging == true) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canvasLeft;
		var cy = evt.pageY - this.canvasTop;
		if (cx < 0) cx = 0;
		if (cx > this.canvasWidth) cx = this.canvasWidth;
		if (cy < 0) cy = 0;
		if (cy > this.canvasHeight) cy = this.canvasHeight;

		this.dragging = false;
	}
};
panelApl.prototype.hMove = function(evt) {
	if (this.dragging == true) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canvasLeft;
		var cy = evt.pageY - this.canvasTop;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		// update the canvas
		this.cursorPos = {x: cx, y: cy};
		this.timer.play();
	}
	return false;
};

panelApl.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	this.ctx.strokeStyle = this.glassColor;

	for (var i = 0; i < this.glass.length; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.glass[i].pos.x, this.glass[i].pos.y);
		this.ctx.lineTo(this.glass[i].posHead.x, this.glass[i].posHead.y);
		this.ctx.stroke();
	}
};

panelApl.prototype.moveObj = function() {
	var cursordx = this.cursorPos.x - this.prevCursorPos.x;
	var cursordy = this.cursorPos.y - this.prevCursorPos.y;

	for (var i = 0; i < this.glass.length; i++) {
		var dx = this.cursorPos.x - this.glass[i].posHead.x;
		var dy = this.cursorPos.y - this.glass[i].posHead.y;

		if (dx*dx + dy*dy < this.effectiveRadius*this.effectiveRadius) {
			var p = this.glass[i].pos;
			var ph = this.glass[i].posHead;
			ph.x += cursordx;
			ph.y += cursordy;
			var dx = ph.x - p.x;
			var dy = ph.y - p.y;
			if (dx*dx + dy*dy > this.glassLength*this.glassLength) {
				var r = Math.sqrt(this.glassLength*this.glassLength/(dx*dx + dy*dy));
				ph.x = p.x + (ph.x - p.x)*r;
				ph.y = p.y + (ph.y - p.y)*r;
			}
		} else {
			var p = this.glass[i].pos;
			var ph = this.glass[i].posHead;
			var dx = ph.x - p.x;
			var dy = ph.y - p.y;

			if (dx != 0 || dy != 0) {
				var r = Math.sqrt(dx*dx + dy*dy);
				var newR = r - this.glassBack;
				if (newR < 0) newR = 0;
				var ratio = newR/r;
				dx *= ratio;
				dy *= ratio;
				ph.x = p.x + dx;
				ph.y = p.y + dy;
			}
		}
	}
	this.prevCursorPos = this.cursorPos;
};

panelApl.prototype.needToUpdate = function() {
	return true;
};

$(function() {
    var apl = new panelApl();
});
