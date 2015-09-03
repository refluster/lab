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
		this.color = 'black'
		this.lineWidth = 1;
		this.PI2 = Math.PI * 2; // 2*pi

		// set the position of the canvas on the browser
		var $canvas = $('#canvas');
		this.cvpos.x = $canvas.offset().left;
		this.cvpos.y = $canvas.offset().top;

		this.raindrop = [];
		this.wave = [];


		/* init canvas
		 * return: none
		 */
		this.blank = function() {
			// clear
			//this.ctx.clearRect(0, 0, this.area.w, this.area.h);
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0, 0, this.area.w, this.area.h);
		};

		this.init = function() {
			/* init process
			 * return: none
			 */

			for (var i = 0; i < 10; i++) {
				this.newDrop();
				//                this.raindrop[i].y = this.random()%200 + 100;
			}

			for (var i = 0; i < 10; i++) {
				this.raindrop[i].y = 160-i*100;
			}
		};

		var _r = 0x12345678;
		this.random = function() {
			//_r = (_r*0x5719342) & 0xffffffff;
			_r = Math.random()*1024;
			return _r;
		};

		this.newDrop = function() {
			var x = this.random()%1000 - 100;
			var start_y = this.random()%200 - 300;
			//var start_y = 0;
			var z = this.random()%500 + 100;
			this.raindrop.push({
				pos:{x:x, y:start_y, z:z},
				speed:{x:0, y:16},
				color:'gray'
			});
			console.log("newdrop (%d,%d,%d)", x, start_y, z);
		};

		/* draw canvas
		 * return: none
		 */
		this.draw = function() {
			this.blank();
			this.ctx.save();
			this.ctx.strokeStyle = 'rgb(160,160,160)';//this.color;
			//this.ctx.globalAlpha = 0.5;

			// draw drop
			for (var i = 0; i < this.wave.length; i++) {
				var a, x, y, z, r;
				z = this.wave[i].pos.z;
				a = 100/z;
				x = this.area.w/2 - (this.area.w/2 - this.wave[i].pos.x)*a;
				y = this.area.h/2 - (this.area.h/2 - this.wave[i].pos.y)*a;
				r = this.wave[i].radius*a;

				this.ctx.strokeEllipse(x - r,
									   y - r/4,
									   x + r,
									   y + r/4);
			}

			// draw raindrop
			for (var i = 0; i < this.raindrop.length; i++) {
				var x, y, z, r, vx, vy;
				z = this.raindrop[i].pos.z;
				a = 100/z;
				x = this.area.w/2 - (this.area.w/2 - this.raindrop[i].pos.x)*a;
				y = this.area.h/2 - (this.area.h/2 - this.raindrop[i].pos.y)*a;
				vx = this.raindrop[i].speed.x*a;
				vy = this.raindrop[i].speed.y*a;

				this.ctx.fillStyle = this.raindrop[i].color;
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				this.ctx.lineTo(x + vx, y + vy);
				this.ctx.stroke();
				console.log("draw drop[%d] = (%d,%d) <- (%d,%d,%d) length:%d",
							i, x, y,
							this.raindrop[i].pos.x, this.raindrop[i].pos.y,
							this.raindrop[i].pos.z,
							this.raindrop.length);
			}

			this.ctx.restore();
		};

		this.moveObj = function() {
			for (var i = 0; i < this.raindrop.length; i++) {
				this.raindrop[i].pos.x += this.raindrop[i].speed.x;
				this.raindrop[i].pos.y += this.raindrop[i].speed.y;

				if (this.raindrop[i].pos.y > this.area.h - 10) {
					var newWave = {
						pos: {x: this.raindrop[i].pos.x,
							  y: this.area.h - 10,
							  z: this.raindrop[i].pos.z},
						speed: 1,
						radius: 1};
					this.wave.push(newWave);

					//
					//this.raindrop[i].pos.y = 10;
					this.raindrop.shift();
					this.newDrop();
					console.log("call newdrop in moveobj");
				}
			}
			for (var i = 0; i < this.wave.length; i++) {
				this.wave[i].radius += 2;//this.wave[i].speed;
				if (this.wave[i].radius > 160) {
					this.wave.shift();
				}
			}
		};
	}

	CanvasRenderingContext2D.prototype.strokeEllipse = 
		function(left, top, right, bottom) {
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
})(jQuery);

