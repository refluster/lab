/* HTML5 Canvas drag&drop */
var canvasManager = {}; // namespace

(function($) {
	/* canvas class
	 * {canvas context} ctx: the context
	 * {int} w: width
	 * {int} h: height
	 * {objext} names: caller namespace
	 */

	canvasManager.canv = function(ctx, w, h, names) {
		this.ctx = ctx; // the context
		this.area = {w:w, h:h};  // the area
		this.cvpos = {x:0, y:0};  // position of the canvas on the browser
		this.prevPos = {x:0, y:0}; // previous position of the cursor
		this.color = 'black';
		this.lineWidth = 1;
		this.PI2 = Math.PI * 2; // 2*pi

		// set the position of the canvas on the browser
		var $cvdiv = $('#cvdiv1');
		this.cvpos.x = $cvdiv.offset().left;
		this.cvpos.y = $cvdiv.offset().top;

		this.gravity = 9.8; // m/s^2
		this.drawInterval = 20; // msec, 1000/fps
		this.theta = Math.PI/30;
		this.px_per_meter = (300/0.06); // 300px per 6cm

		this.center = {x:200, y:200};
		this.accel = this.gravity*this.px_per_meter*Math.sin(this.theta);

		this.radius = 14; // raduis of balls
		this.ball = [];

		this.blank = function() {
			//this.ctx.clearRect(0, 0, this.area.w, this.area.h);
			this.ctx.fillStyle = 'black';
			this.ctx.fillRect(0, 0, this.area.w, this.area.h);
		};

		this.init = function() {
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

		this.getNormalVector = function(dst, src) {
			var v = {x:dst.x - src.x, y:dst.y - src.y};
			var d = Math.sqrt(v.x*v.x + v.y*v.y);
			return {x:v.x/d, y:v.y/d};
		};

		this.setFps = function(fps) {
			this.drawInterval = 1000/fps;
		};

		this.setGravity = function(gravity) {
			this.gravity = gravity;
			this.accel = this.gravity*this.px_per_meter*Math.sin(this.theta);
		};

		this.moveObj = function() {
			// (m/s/s)*(interval)*(interval)
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

		this.draw = function() {
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

	}

})(jQuery);
