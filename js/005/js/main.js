var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.ctx = canvas.getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";
	
	this.canvas();
	this.canvasWidth = canvas.width;
	this.canvasHeight = canvas.height;
	this.draw();
	
    this.timer = $.timer();
    this.timer.set({
        action: function() {
			this.moveObj();
			this.draw();
        }.bind(this),
        time: 15
    });
	this.timer.play();
};
Apl.prototype.canvas = function() {
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
	this.prevPos = {x:0, y:0}; // previous position of the cursor
	this.color = 'black';
	this.lineWidth = 1;
	this.PI2 = Math.PI * 2; // 2*pi
	this.radius = 30; // raduis of balls

	// set the position of the canvas on the browser
	var $canvas = $('#canvas');
	this.cvpos.x = $canvas.offset().left;
	this.cvpos.y = $canvas.offset().top;

	this.ball = [];

	this.ball.push({
		pos:{x:100, y:100},
		speed:{x:2, y:4},
		color:'green'
	});
	this.ball.push({
		pos:{x:150, y:100},
		speed:{x:4, y:-2},
		color:'red'
	});
	this.ball.push({
		pos:{x:200, y:100},
		speed:{x:-4, y:2},
		color:'blue'
	});
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};
Apl.prototype.draw = function() {
	this.blank();
	this.ctx.save();
	this.ctx.strokeStyle = this.color;
	this.ctx.globalAlpha = 0.5;
	
	for (var i = 0; i < this.ball.length; i++) {
		this.ctx.fillStyle = this.ball[i].color;
		this.ctx.beginPath();
		this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
					 this.radius, 0, this.PI2, false);
		this.ctx.fill();
	}
	
	this.ctx.restore();
};
Apl.prototype.moveObj = function() {
	for (var i = 0; i < this.ball.length; i++) {
		this.ball[i].pos.x += this.ball[i].speed.x;
		this.ball[i].pos.y += this.ball[i].speed.y;
		if (this.ball[i].pos.x + this.radius > this.canvasWidth) {
			this.ball[i].pos.x = this.canvasWidth - (this.ball[i].pos.x + this.radius - this.canvasWidth) - this.radius;
			this.ball[i].speed.x = -this.ball[i].speed.x;
		}
		if (this.ball[i].pos.x - this.radius < 0) {
			this.ball[i].pos.x = -(this.ball[i].pos.x - this.radius) + this.radius;
			this.ball[i].speed.x = -this.ball[i].speed.x;
		}
		if (this.ball[i].pos.y + this.radius > this.canvasHeight) {
			this.ball[i].pos.y = this.canvasHeight - (this.ball[i].pos.y + this.radius - this.canvasHeight) - this.radius;
			this.ball[i].speed.y = -this.ball[i].speed.y;
		}
		if (this.ball[i].pos.y - this.radius < 0) {
			this.ball[i].pos.y = -(this.ball[i].pos.y - this.radius) + this.radius;
			this.ball[i].speed.y = -this.ball[i].speed.y;
		}
	}            
};

$(function() {
	apl = new Apl();
});
