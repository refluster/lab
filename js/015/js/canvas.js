var canvasManager = function(ctx, w, h, names) {
		this.ctx = ctx; // the context
		this.area = {w:w, h:h};  // the area
		this.cvpos = {x:0, y:0};  // position of the canvas on the browser

		// set the position of the canvas on the browser
		var $canvas = $('#canvas');
		this.cvpos.x = $canvas.offset().left;
		this.cvpos.y = $canvas.offset().top;

		this.color = 'white'
		this.lineWidth = 1;
		this.PI2 = Math.PI * 2; // 2*pi
		this.radius = 30; // raduis of balls

		this.leaf = [];
};

		/* init canvas
		 * return: none
		 */
canvasManager.prototype.blank = function() {
			// clear
			this.ctx.fillStyle = 'black';
			//this.ctx.clearRect(0, 0, this.area.w, this.area.h);
			this.ctx.fillRect(0, 0, this.area.w, this.area.h);
};

canvasManager.prototype.init = function() {
			for (var i = 0; i < 1000; i++) {
				var rand = Math.floor(Math.random()*1024*1024);
				var x = rand%(this.area.w - 1);
				var y = rand%this.area.h;
				var r = 6 + rand%7;
				/*
				  var x = Math.floor(Math.random()*this.area.w);
				  var y = Math.floor(Math.random()*this.area.h);
				  var r = 6 + Math.floor(Math.random()*7);
				*/
				this.leaf.push({
					pos:{x:x, y:y},
					radius:r
				});
			}
};

		/* draw canvas
		 * return: none
		 */
canvasManager.prototype.draw = function() {
			var sin5 = []
			var cos5 = [];

			for (var i = 0; i < 5; i++) {
				sin5[i] = Math.sin(i*Math.PI/5);
				cos5[i] = Math.cos(i*Math.PI/5);
			}

			this.blank();
			this.ctx.save();
			this.ctx.strokeStyle = this.color;
			this.ctx.globalAlpha = 0.5;

			for (var i = 0; i < this.leaf.length; i++) {
				var l = this.leaf[i];
				this.ctx.beginPath();

				for (var j = 0; j < cos5.length; j++) {
					this.ctx.moveTo(l.pos.x + Math.floor(l.radius*cos5[j]),
									l.pos.y + Math.floor(l.radius*sin5[j]));
					this.ctx.lineTo(l.pos.x - Math.floor(l.radius*cos5[j]),
									l.pos.y - Math.floor(l.radius*sin5[j]));
				}

				this.ctx.stroke();

			}

			this.ctx.restore();
};
