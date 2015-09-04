var panelApl = function() {
	var $canvas = $('canvas');
	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', '300');
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();

	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	// init canvas
	this.raindrop = [];
	this.wave = [];

	for (var i = 0; i < 10; i++) {
		this.newDrop();
		// set initial height of raindrop randomly
		this.raindrop[i].y = 160 - i*100;
	}

	// start timer
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

panelApl.prototype.blank = function() {
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

panelApl.prototype.random = function() {
	return Math.random()*4096;
};

panelApl.prototype.newDrop = function() {
	var x = this.random()%1000 - 100;
	var start_y = this.random()%200 - 300;
	var z = this.random()%500 + 100;
	this.raindrop.push({
		pos:{x:x, y:start_y, z:z},
		speed:{x:0, y:16},
		color:'gray'
	});
};

panelApl.prototype.newWave = function(x, y, z) {
	this.wave.push({
		pos: {x: x, y: y, z: z},
		speed: 1,
		radius: 1});
};

panelApl.prototype.draw = function() {
	this.blank();
	this.ctx.strokeStyle = 'rgb(160,160,160)';

	// draw drop
	for (var i = 0; i < this.wave.length; i++) {
		var a, x, y, r;
		a = 100/this.wave[i].pos.z;
		x = this.canvasWidth/2 - (this.canvasWidth/2 - this.wave[i].pos.x)*a;
		y = this.canvasHeight/2 - (this.canvasHeight/2 - this.wave[i].pos.y)*a;
		r = this.wave[i].radius*a;

		this.ctx.strokeEllipse(x - r, y - r/4, x + r, y + r/4);
	}

	// draw raindrop
	for (var i = 0; i < this.raindrop.length; i++) {
		var x, y, r, vx, vy;
		a = 100/this.raindrop[i].pos.z;
		x = this.canvasWidth/2 - (this.canvasWidth/2 - this.raindrop[i].pos.x)*a;
		y = this.canvasHeight/2 - (this.canvasHeight/2 - this.raindrop[i].pos.y)*a;
		vx = this.raindrop[i].speed.x*a;
		vy = this.raindrop[i].speed.y*a;

		this.ctx.fillStyle = this.raindrop[i].color;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x + vx, y + vy);
		this.ctx.stroke();
	}
};

panelApl.prototype.moveObj = function() {
	for (var i = 0; i < this.raindrop.length; i++) {
		this.raindrop[i].pos.x += this.raindrop[i].speed.x;
		this.raindrop[i].pos.y += this.raindrop[i].speed.y;

		if (this.raindrop[i].pos.y > this.canvasHeight - 10) {
			this.newWave(this.raindrop[i].pos.x,
						 this.canvasHeight - 10,
						 this.raindrop[i].pos.z);
			this.raindrop.shift();
			this.newDrop();
		}
	}
	for (var i = 0; i < this.wave.length; i++) {
		this.wave[i].radius += 2;
		if (this.wave[i].radius > 160) {
			this.wave.shift();
		}
	}
};

CanvasRenderingContext2D.prototype.strokeEllipse = function(left, top, right, bottom) {
	var halfWidth = (right - left) / 2.0;
	var halfHeight = (bottom - top) / 2.0;
	var x0 = left + halfWidth;
	var y1 = top + halfHeight;
	this.beginPath();
	var cw = 4.0 * (Math.sqrt(2.0) - 1.0) * halfWidth / 3.0;
	var ch = 4.0 * (Math.sqrt(2.0) - 1.0) * halfHeight / 3.0;
	this.moveTo(x0, top);
	this.bezierCurveTo(x0 + cw, top, right, y1 - ch, right, y1);
	this.bezierCurveTo(right, y1 + ch, x0 + cw, bottom, x0, bottom);
	this.bezierCurveTo(x0 - cw, bottom, left, y1 + ch, left, y1);
	this.bezierCurveTo(left, y1 - ch, x0 - cw, top, x0, top);
	this.stroke();
};

$(function() {
	var apl = new panelApl();
});
