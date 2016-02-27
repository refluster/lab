var Apl = function() {
	// get canvas's DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	$canvas.attr('width', this.canvasWidth);
	$canvas.attr('height', this.canvasHeight);

	// display
	this.area = {w:$canvas.width(), h:$canvas.height()};  // the area
	this.PI2 = Math.PI * 2; // 2*pi

	this.gravity = 9.8; // m/s^2
	this.drawInterval = 20; // msec, 1000/fps
	this.sinTheta = Math.sin(Math.PI/30);
	this.px_per_meter = (300/0.06); // 300px per 6cm

	this.center = {x:200, y:200};

	this.radius = 14; // raduis of balls
	this.ball = [];
	//////////////////////////////

	this.ballInit();
	this.draw();

	this.timer = $.timer();

	// set events
	$('#btn-apply').mousedown(this.updateParam.bind(this));
};

Apl.prototype.updateParam = function() {
	// set parameters from web form
	var gravity = document.form1.input_gravity.value;
	var fps = document.form1.input_fps.value;
	// check if inputs are number
	if (isNaN(gravity) || isNaN(fps)) {
		return;
	}
	gravity = Number(gravity);
	fps = Number(fps);
	if (gravity < 0 || fps < 0) {
		return;
	}
	this.setGravity(gravity);
	this.setFps(fps);

	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
		}.bind(this),
		time: 1000/fps
	});

	this.timer.play();
};

Apl.prototype.ballInit = function() {
	this.ball[0] = {
		pos:{x:100, y:100},
		v:{x:2, y:4},
	};
	this.ball[1] = {
		pos:{x:200, y:100},
		v:{x:3, y:4},
	};
	this.ball[2] = {
		pos:{x:150, y:110},
		v:{x:2, y:-4},
	};
	this.ball[3] = {
		pos:{x:280, y:210},
		v:{x:2, y:-4},
	};
	this.ball[4] = {
		pos:{x:500, y:180},
		v:{x:2, y:-4},
	};
};

Apl.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.area.w, this.area.h);
};

Apl.prototype.getNormalVector = function(dst, src) {
	var v = {x:dst.x - src.x, y:dst.y - src.y};
	var d = Math.sqrt(v.x*v.x + v.y*v.y);
	return {x:v.x/d, y:v.y/d};
};

Apl.prototype.setFps = function(fps) {
	this.drawInterval = 1000/fps;
};

Apl.prototype.setGravity = function(gravity) {
	this.gravity = gravity;
	this.accel = this.gravity*this.px_per_meter*this.sinTheta;
};

Apl.prototype.moveObj = function() {
	var intervalAccel = this.accel*
		this.drawInterval*this.drawInterval/1000000;

	// calc pos
	for (var i = 0; i < this.ball.length; i++) {
		this.ball[i].pos.x += this.ball[i].v.x;
		this.ball[i].pos.y += this.ball[i].v.y;
	}

	// calc vel (inc accel)
	for (var i = 0; i < this.ball.length; i++) {
		var p = this.ball[i].pos;
		var nvec = this.getNormalVector(this.center, this.ball[i].pos);
		this.ball[i].v.x += nvec.x*intervalAccel;
		this.ball[i].v.y += nvec.y*intervalAccel;
	}
};

Apl.prototype.draw = function() {
	this.blank();
	this.ctx.save();

	this.ctx.strokeStyle = 'rgb(160,160,160)';
	var r = 600;
	var n = 13;
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
    var apl = new Apl();
});
