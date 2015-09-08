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
		this.color = 'black'
		this.lineWidth = 1;
		this.PI2 = Math.PI * 2; // 2*pi

		// set the position of the canvas on the browser
		var $cvdiv = $('#cvdiv1');
		this.cvpos.x = $cvdiv.offset().left;
		this.cvpos.y = $cvdiv.offset().top;

		this.center = {x:200, y:200};
		this.accel = 25.0 /(1000/40);

		this.radius = 18; // raduis of balls

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
		};

		this.getNormalVector = function(dst, src) {
			var v = {x:dst.x - src.x, y:dst.y - src.y};
			var d = Math.sqrt(v.x*v.x + v.y*v.y);
			return {x:v.x/d, y:v.y/d};
		};

		this.moveObj = function() {
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

		this.draw = function() {
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

	}

})(jQuery);

