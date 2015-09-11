var panelApl = function() {
	// timer
	this.timer = $.timer();

	// get canvas's DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	var ctx = $canvas[0].getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', $canvas.height());

	// display
	this.canv = new canvasManager(ctx, $canvas.width(),
								  $canvas.height(), this);
	this.canv.init();

	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.draw();
		}.bind(this),
		time: 40
	});
	this.timer.play();
};

var canvasManager = function(ctx, w, h, name) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
	this.prevPos = {x:0, y:0}; // previous position of the cursor
	this.color = 'black';
	this.lineWidth = 1;
	this.PI2 = Math.PI * 2; // 2*pi

	// set the position of the canvas on the browser
	var $canvas = $('#canvas');
	this.cvpos.x = $canvas.offset().left;
	this.cvpos.y = $canvas.offset().top;

	this.center = {x:200, y:200};
	this.accel = 25.0 /(1000/40);

	this.radius = 18; // raduis of balls

	this.ball = [];
};
canvasManager.prototype.blank = function() {
	//this.ctx.clearRect(0, 0, this.area.w, this.area.h);
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.area.w, this.area.h);
};

canvasManager.prototype.init = function() {
	this.ball[0] = {
		pos:{x:100, y:100},
		v:{x:2, y:4},
	};
};

canvasManager.prototype.getNormalVector = function(dst, src) {
	var v = {x:dst.x - src.x, y:dst.y - src.y};
	var d = Math.sqrt(v.x*v.x + v.y*v.y);
	return {x:v.x/d, y:v.y/d};
};

canvasManager.prototype.moveObj = function() {
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

canvasManager.prototype.draw = function() {
	this.blank();
	this.ctx.save();

	this.ctx.strokeStyle = 'rgb(160,160,160)';
	var r = 600;
	var n = 17;
	this.ctx.beginPath();
	for (var i = 0; i < n; i++) {
		var dx = r*Math.cos(Math.PI/n*i);
		var dy = r*Math.sin(Math.PI/n*i);
		this.ctx.moveTo(this.center.x + dx, this.center.y + dy);
		this.ctx.lineTo(this.center.x - dx, this.center.y - dy);
	}
	this.ctx.stroke();

	// draw ball
	this.ctx.fillStyle = 'white';
	//this.ctx.globalAlpha = 0.5;
	for (var i = 0; i < this.ball.length; i++) {
		this.ctx.fillStyle = this.ball[i].color;
		this.ctx.beginPath();
		this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
					 this.radius, 0, this.PI2, false);
		this.ctx.fill();
	}

	this.ctx.restore();
};

$(function() {
	var apl = new panelApl();
});

