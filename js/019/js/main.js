/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var Apl = function() {
	this.gamestart = false;  // true if playing

	// timer
	this.timer = $.timer();

	this.fps = 30;

	// get canvas's DOM element and context
	this.canvas = document.getElementById('cv1');
	if ( ! this.canvas || ! this.canvas.getContext ) { return false; }
	var ctx = this.canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// display
/*
	this.canv = new canvasManager.canv(ctx, canvas.width,
									   canvas.height, this);
	this.canv.init();
	this.canv.draw();
*/
	this.constract(ctx, this.canvas.width, this.canvas.height);
	this.init();
	this.draw();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start.bind(this));
	$btn.text('update');
};

Apl.prototype.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
	var $btn = $('#stbtn1'); // start button

	//// set parameters from web form
	var gravity = document.form1.input_gravity.value;
	var cor = document.form1.input_cor.value;
	// check if inputs are number
	if (isNaN(gravity) || isNaN(cor)) {
		return;
	}
	gravity = Number(gravity);
	cor = Number(cor);
	if (gravity < 0 || cor < 0) {
		return;
	}
	this.setGravity(gravity);
	this.setCor(cor);

	// init canvas
	this.init();

	this.setFps(this.fps);

	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
		}.bind(this),
		time: 1000/this.fps
	});

	this.timer.play();
};

//------------------------------/

//	this.canv = new canvasManager.canv(ctx, canvas.width,
//									   canvas.height, this);

Apl.prototype.constract = function(ctx, w, h) {
//		this.area = {w:w, h:h};  // the area
	this.ctx = ctx;
	this.canvasWidth = w;
	this.canvasHeight = h;
		this.cvpos = {x:0, y:0};  // position of the canvas on the browser
		this.prevPos = {x:0, y:0}; // previous position of the cursor
		this.color = 'black'
		this.lineWidth = 1;
		this.PI2 = Math.PI * 2; // 2*pi

		// set the position of the canvas on the browser
		var $cvdiv = $('#cv1');
		this.cvpos.x = $cvdiv.offset().left;
		this.cvpos.y = $cvdiv.offset().top;

		// environment parameter
		this.gravity = 9.8; // m/s^2
		this.drawInterval = 33;
		this.theta = Math.PI/90;
		this.px_per_meter = (300/6); // 300px per 6cm
		this.center = {x:200, y:200};
		this.radius = 15; // raduis of balls
		this.cor = 0.8; // coefficient of restitution

		// calculated value (not modify manually)
		this.accel = this.gravity*this.px_per_meter*Math.sin(this.theta);

		this.ball = [];
};

Apl.prototype.blank = function() {
			//this.ctx.clearRect(0, 0, this.area.w, this.area.h);
			this.ctx.fillStyle = 'black';
			this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Apl.prototype.init = function() {
			var n = 6;
			this.ball = [];
			for (var i = 0; i < n; i++) {
				var r = Math.floor(Math.random()*0x12345678);
				this.ball.push({
					pos:{x:r%this.canvasWidth/2, y:r%(this.canvasHeight - 1)},
					v:{x:0, y:0},
					//v:{x:2, y:4},
				});
			}
};

Apl.prototype.setFps = function(fps) {
			this.drawInterval = 1000/fps;
};

Apl.prototype.setCor = function(cor) {
			this.cor = cor;
};

Apl.prototype.setGravity = function(gravity) {
			this.gravity = gravity;
			this.accel = this.gravity*this.px_per_meter*Math.sin(this.theta);
};

Apl.prototype.getNormalVector = function(dst, src) {
			var v = {x:dst.x - src.x, y:dst.y - src.y};
			var d = Math.sqrt(v.x*v.x + v.y*v.y);
			return {x:v.x/d, y:v.y/d};
};

Apl.prototype.moveObj = function() {
			// (m/s/s)*(interval)
			var intervalAccel = this.accel*
				this.drawInterval/1000;

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

			// collision detection and re-calc vel
			for (var i = 0; i < this.ball.length; i++) {
				var v1 = this.ball[i].v;
				var p1 = this.ball[i].pos;
				for (var j = i + 1; j < this.ball.length; j++) {
					var v2 = this.ball[j].v;
					var p2 = this.ball[j].pos;
					var d12 = {x:p2.x - p1.x, y:p2.y - p1.y};

					if (Math.abs(d12.x) < 2*this.radius &&
						Math.abs(d12.y) < 2*this.radius &&
						d12.x*d12.x + d12.y*d12.y < 4*this.radius*this.radius) {

						// collision detected
						var tan = parseFloat(d12.y)/d12.x;
						var abs_cos = 1/Math.sqrt(tan*tan + 1);
						var cos = (d12.x > 0 ? abs_cos : -abs_cos);
						var sin = tan*cos;

						// rotate coordinates -theta
						var u1 = {x:v1.x*cos + v1.y*sin,
								  y:-v1.x*sin + v1.y*cos};
						var u2 = {x:v2.x*cos + v2.y*sin,
								  y:-v2.x*sin + v2.y*cos};

						// temp var
						var u1x = u1.x;
						var u2x = u2.x;

						// next vel
						u1.x = this.cor*u2x + (1.0 - this.cor)*(u1x + u2x)/2;
						u2.x = this.cor*u1x + (1.0 - this.cor)*(u1x + u2x)/2;

						// rotate coordinates +theta
						v1.x = u1.x*cos - u1.y*sin;
						v1.y = u1.x*sin + u1.y*cos;
						v2.x = u2.x*cos - u2.y*sin;
						v2.y = u2.x*sin + u2.y*cos;

						// set pos again
						var d = this.radius -
							Math.sqrt(d12.x*d12.x + d12.y*d12.y)/2;
						p1.x = p1.x - d*cos;
						p1.y = p1.y - d*sin;
						p2.x = p2.x + d*cos;
						p2.y = p2.y + d*sin;
					}
				}
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


/* body onload process */
$(function() {
    var apl = new Apl();
});
