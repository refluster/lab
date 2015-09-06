var panelApl = function() {
	this.simulating = false;
	this.timer = $.timer();
	this.fps = 30;

	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");

	// canvas
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
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

	this.init();
	this.draw();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start.bind(this));
	$btn.text('start');

	this.timer.set({
		action: function() {
			this.moveObj();
			this.draw();
		}.bind(this),
		time: 1000/this.fps
	});
};

panelApl.prototype.start = function() {
	var $btn = $('#stbtn1'); // start button

	if (!this.simulating) { // if not playing
		// init canvas
		this.init();
		this.simulating = true;
		this.timer.play();
		$btn.text('stop');
	} else { // if playing
		this.simulating = false;
		this.timer.pause();
		$btn.text('start');
	}
};

panelApl.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

panelApl.prototype.init = function() {
	this.sph = new Sph();
	this.sph.init();
};

panelApl.prototype.moveObj = function() {
	this.sph.step();
};

panelApl.prototype.draw = function() {
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

$(function() {
    var apl = new panelApl();
});
