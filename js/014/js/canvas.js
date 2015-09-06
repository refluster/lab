var canvasManager = function(ctx, w, h, names) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
	this.lineWidth = 1;
	this.PI2 = Math.PI * 2; // 2*pi
	this.effectiveRadius = 30; // raduis of balls

	// set the position of the canvas on the browser
	var $canvas = $('#canvas');
	this.cvpos.x = $canvas.offset().left;
	this.cvpos.y = $canvas.offset().top;

	this.prevCursorPos = {x:0, y:0}; // cursor position of previous frame
	this.cursorPos = {x:0, y:0};

	this.glass = [];
	this.glassColor = 'black';
	this.glassLength = 10;
	this.glassBack = 2;

	for (var i = 0; i < 40; i++) {
		for (var j = 0; j < 40; j++) {
			this.glass[i*40+j] = {
				pos:{x:i*5, y:j*5},
				posHead:{x:i*5, y:j*5}
			};
		}
	}

};

canvasManager.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.area.w, this.area.h);
};

canvasManager.prototype.init = function() {

};

canvasManager.prototype.draw = function() {
	this.blank();
	this.ctx.save();
	this.ctx.strokeStyle = this.glassColor;

	for (var i = 0; i < this.glass.length; i++) {
		this.ctx.fillStyle = this.glassColor;
		this.ctx.beginPath();
		this.ctx.moveTo(this.glass[i].pos.x, this.glass[i].pos.y);
		this.ctx.lineTo(this.glass[i].posHead.x, this.glass[i].posHead.y);
		this.ctx.stroke();
	}

	this.ctx.restore();
};

canvasManager.prototype.moveObj = function() {
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
			var rmax = this.glassLength;
			if (dx*dx + dy*dy > rmax*rmax) {
				var r = Math.sqrt(rmax*rmax/(dx*dx + dy*dy));
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

canvasManager.prototype.moveTo = function(pos) {
	this.cursorPos = pos;
};

canvasManager.prototype.needToUpdate = function() {
	return true;
};

