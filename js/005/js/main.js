var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.canvasWidth = canvas.width;
	this.canvasHeight = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";
	this.ctx.globalAlpha = 0.5;
	
	this.ball = [];
	this.ball.push({
		pos: {x:100, y:100},
		speed: {x:2, y:4},
		color: 'green'
	});
	this.ball.push({
		pos: {x:150, y:100},
		speed: {x:4, y:-2},
		color: 'red'
	});
	this.ball.push({
		pos: {x:200, y:100},
		speed: {x:-4, y:2},
		color: 'blue'
	});

	this.PI2 = Math.PI * 2; // 2*pi
	this.radius = 30; // ball radius
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
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};
Apl.prototype.draw = function() {
	this.blank();
	
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
		this.ball[i].pos.x += this.ball[i].speed.x;
		this.ball[i].pos.y += this.ball[i].speed.y;
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
			this.ball[i].pos.y = this.canvasHeight -
				(this.ball[i].pos.y + this.radius - this.canvasHeight) - this.radius;
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
