var Apl = function() {
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	$canvas.attr('width', this.canvasWidth);
	$canvas.attr('height', this.canvasHeight);

	this.PI2 = Math.PI * 2; // 2*pi
	this.center = {x:200, y:200};
	this.accel = 25.0 /(1000/40);
	this.radius = 18; // raduis of balls
	this.ball = [];
	this.ball.push({
		pos:{x:100, y:100},
		v:{x:2, y:4},
	});

	var n = 17;
	this.sin = [];
	this.cos = [];
	for (var i = 0; i < n; i++) {
		this.sin[i] = Math.sin(Math.PI/n*i);
		this.cos[i] = Math.cos(Math.PI/n*i);
	}

	this.timer = $.timer();
	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
		}.bind(this),
		time: 40
	});
	this.timer.play();
};
Apl.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};
Apl.prototype.getNormalVector = function(dst, src) {
	var v = {x:dst.x - src.x, y:dst.y - src.y};
	var d = Math.sqrt(v.x*v.x + v.y*v.y);
	return {x:v.x/d, y:v.y/d};
};
Apl.prototype.moveObj = function() {
	// calc pos
	for (var i = 0; i < this.ball.length; i++) {
		this.ball[i].pos.x += this.ball[i].v.x;
		this.ball[i].pos.y += this.ball[i].v.y;
	}
	// calc v
	for (var i = 0; i < this.ball.length; i++) {
		var p = this.ball[i].pos;
		var nvec = this.getNormalVector(this.center, this.ball[i].pos);
		this.ball[i].v.x += nvec.x*this.accel;
		this.ball[i].v.y += nvec.y*this.accel;
	}
};
Apl.prototype.draw = function() {
	this.blank();
	this.ctx.strokeStyle = 'rgb(160,160,160)';
	var r = 600;

	this.ctx.beginPath();
	for (var i = 0; i < this.sin.length; i++) {
		this.ctx.moveTo(this.center.x + r*this.cos[i], this.center.y + r*this.sin[i]);
		this.ctx.lineTo(this.center.x - r*this.cos[i], this.center.y - r*this.sin[i]);
	}
	this.ctx.stroke();

	for (var i = 0; i < this.ball.length; i++) {
		this.ctx.fillStyle = this.ball[i].color;
		this.ctx.beginPath();
		this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
					 this.radius, 0, this.PI2, false);
		this.ctx.fill();
	}
};

$(function() {
	var apl = new Apl();
});
