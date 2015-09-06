var canvasManager = function(ctx, w, h, names) {
	this.ctx = ctx; // the context
	this.canvasWidth = w;
	this.canvasHeight = h;
	this.prevPos = {x:0, y:0}; // previous position of the cursor
	this.lineWidth = 1;
	this.PI2 = Math.PI * 2; // 2*pi

	// set the position of the canvas on the browser
	var $cvdiv = $('#canvas');
	this.canvasLeft = $cvdiv.offset().left;
	this.canvasTop = $cvdiv.offset().top;

	// environment parameter
	this.radius = 1; // raduis of balls
	this.particles = [];
	this.sph;

	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";
};

canvasManager.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

canvasManager.prototype.init = function() {
	this.sph = new Sph();
	this.sph.init();
};

canvasManager.prototype.moveObj = function() {
	this.sph.step();
};

canvasManager.prototype.draw = function() {
	this.blank();
	this.ctx.fillStyle = 'white';
	var p = this.sph.get_particle();
	for (var i = 0; i < p.length; i++) {
		this.ctx.beginPath();
		this.ctx.arc(p[i].pos.x*8, this.canvasHeight - p[i].pos.y*8,
					 this.radius, 0, this.PI2, false);
		this.ctx.fill();
	}
};

