var Apl = function() {
	// drag state
	this.dragging = false;

	// get canvas's DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	// get canvas info
	this.canvasLeft = $canvas.offset().left;
	this.canvasTop = $canvas.offset().top;
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	$canvas.attr('width', this.canvasWidth);
	$canvas.attr('height', this.canvasHeight);

	// display
	this.PI2 = Math.PI * 2; // 2*pi
	this.radius = 30; // raduis of balls
	this.holdBallIdx = null; // index of the hold ball (for positioning)
	this.releasedBallIdx = null; // index of the released ball (for speed setting)
	this.prevHoldBallPos = {x:0, y:0}; // previous hold ball pos (updated by timer)

	// balls
	this.ball = [];
	this.ball[0] = {
		pos:{x:100, y:100},
		speed:{x:0, y:0, abs:0},
		color:'green',
		moveNow: false
	};
	this.ball[1] = {
		pos:{x:150, y:180},
		speed:{x:0, y:0, abs:0},
		color:'#ab0230',
		moveNow: false
	};

	// initial display
	this.draw();

	// timer
	this.timer = $.timer();
	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
			if (! this.needToUpdate()) {
				this.timer.pause();
			}
		}.bind(this),
		time: 40
	});

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

};
Apl.prototype.getCanvasPosition = function(e) {
	if (e.originalEvent.touches != undefined && e.originalEvent.touches.length > 0) {
		return {x: parseInt(e.originalEvent.touches[0].pageX - this.canvasLeft),
				y: parseInt(e.originalEvent.touches[0].pageY - this.canvasTop)};
	} else {
		return {x: parseInt(e.pageX - this.canvasLeft),
				y: parseInt(e.pageY - this.canvasTop)};
	}
};
Apl.prototype.hDown = function(e) {
	var p = this.getCanvasPosition(e);
	this.dragging = true;
	this.holdAt(p);
	return false;
};
Apl.prototype.hUp = function(e) {
	if (this.dragging) {
		var p = this.getCanvasPosition(e);
		if (p.x < 0) p.x = 0;
		if (p.x > this.canvasWidth) p.x = this.canvasWidth;
		if (p.y < 0) p.y = 0;
		if (p.y > this.canvasHeight) p.y = this.canvasHeight;

		this.dragging = false;
		this.setSpeedMovedObj();
		this.releaseAt(p);
		this.timer.play();
	}
};
Apl.prototype.hMove = function(e) {
	if (this.dragging) {
		var p = this.getCanvasPosition(e);
		this.moveTo(p);
		this.draw();
	}
	return false;
};
Apl.prototype._blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};
Apl.prototype.draw = function() {
	this._blank();
	this.ctx.strokeStyle = this.color;
	this.ctx.globalAlpha = 0.5;

	for (var i = 0; i < this.ball.length; i++) {
		this.ctx.fillStyle = this.ball[i].color;
		this.ctx.beginPath();
		this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
					 this.radius, 0, this.PI2, false);
		this.ctx.fill();
	}
};
Apl.prototype.moveObj = function() {
	for (var i = 0; i < this.ball.length; i++) {
		if (this.ball[i].moveNow) {
			var newSpeed = {x:0, y:0, abs:0};
			this.ball[i].pos.x += this.ball[i].speed.x;
			this.ball[i].pos.y += this.ball[i].speed.y;

			// friction (slowdown)
			if (this.ball[i].speed.abs <= 1) {
				newSpeed.abs = 0;
				newSpeed.x = 0;
				newSpeed.y = 0;
			} else {
				newSpeed.abs = this.ball[i].speed.abs - 1;
				newSpeed.x = this.ball[i].speed.x*newSpeed.abs/this.ball[i].speed.abs;
				newSpeed.y = this.ball[i].speed.y*newSpeed.abs/this.ball[i].speed.abs;
			}

			if (newSpeed.abs == 0) {
				this.ball[i].moveNow = false;
			}
			this.ball[i].speed = newSpeed;

			if (this.ball[i].pos.x + this.radius > this.canvasWidth) {
				this.ball[i].pos.x = this.canvasWidth -
					(this.ball[i].pos.x + this.radius - this.canvasWidth) - this.radius;
				this.ball[i].speed.x = -this.ball[i].speed.x;
			}
			if (this.ball[i].pos.x - this.radius < 0) {
				this.ball[i].pos.x = -(this.ball[i].pos.x - this.radius) + this.radius;
				this.ball[i].speed.x = -this.ball[i].speed.x;
			}
			if (this.ball[i].pos.y + this.radius > this.canvasHeight) {
				this.ball[i].pos.y = this.canvasHeight
					- (this.ball[i].pos.y + this.radius - this.canvasHeight) - this.radius;
				this.ball[i].speed.y = -this.ball[i].speed.y;
			}
			if (this.ball[i].pos.y - this.radius < 0) {
				this.ball[i].pos.y = -(this.ball[i].pos.y - this.radius) + this.radius;
				this.ball[i].speed.y = -this.ball[i].speed.y;
			}
		}
	}
};
Apl.prototype.needToUpdate = function() {
	var i;
	if (this.holdBallIdx != null) {
		return true;
	}
	for (i = 0; i < this.ball.length; i++) {
		if (this.ball[i].moveNow == true) {
			return true;
		}
	}
	return false;
};
Apl.prototype.setSpeedMovedObj = function() {
	var reduce = 10;
	var reducedAbsSpeed;
	var curSpeed = {x:0, y:0, abs:0};

	if (this.holdBallIdx != null) {
		reducedAbsSpeed = this.ball[this.holdBallIdx].speed.abs - reduce;

		curSpeed.x = this.ball[this.holdBallIdx].pos.x - this.prevHoldBallPos.x;
		curSpeed.y = this.ball[this.holdBallIdx].pos.y - this.prevHoldBallPos.y;
		curSpeed.abs = Math.sqrt(curSpeed.x*curSpeed.x + curSpeed.y*curSpeed.y);

		this.ball[this.holdBallIdx].speed = curSpeed;

		this.prevHoldBallPos.x = this.ball[this.holdBallIdx].pos.x;
		this.prevHoldBallPos.y = this.ball[this.holdBallIdx].pos.y;
	}

	if (this.releasedBallIdx != null) {
		if (this.ball[this.releasedBallIdx].speed.abs != 0) {
			this.ball[this.releasedBallIdx].moveNow = true;
		}
		this.releasedBallIdx = null;
	}
};
Apl.prototype.holdAt = function(pos) {
	// check if the clicked position is on a ball
	for (var i = 0; i < this.ball.length; i++) {
		if (this.ball[i].pos.x - this.radius < pos.x &&
			this.ball[i].pos.x + this.radius > pos.x &&
			this.ball[i].pos.y - this.radius < pos.y &&
			this.ball[i].pos.y + this.radius > pos.y) {
			this.holdBallIdx = i;
			this.prevCursorPos = pos;
			this.prevHoldBallPos.x = this.ball[i].pos.x;
			this.prevHoldBallPos.y = this.ball[i].pos.y;
			this.ball[i].moveNow = false;
		}
	}
};
Apl.prototype.releaseAt = function(pos) {
	if (this.holdBallIdx != null) {
		this.releasedBallIdx = this.holdBallIdx;
		this.holdBallIdx = null;
	}
};
Apl.prototype.moveTo = function(pos) {
	if (this.holdBallIdx != null) {
		this.ball[this.holdBallIdx].pos.x += pos.x - this.prevCursorPos.x;
		this.ball[this.holdBallIdx].pos.y += pos.y - this.prevCursorPos.y;
		this.prevCursorPos = pos;
	}
};

$(function() {
	apl = new Apl();
});
