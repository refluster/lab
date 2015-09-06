var panelApl = function() {
	this.simulating = false;
	this.timer = $.timer();
	this.fps = 30;

	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	var ctx = $canvas[0].getContext("2d");

	// canvas
	this.canv = new canvasManager(ctx, $canvas.width(), $canvas.height());
	this.canv.init();
	this.canv.draw();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start.bind(this));
	$btn.text('start');

	// show message
	window.addEventListener('devicemotion', this.readGravity);

	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.draw();
		}.bind(this),
		time: 1000/this.fps
	});

};

panelApl.prototype.start = function() {
	var $btn = $('#stbtn1'); // start button

	if (!this.simulating) { // if not playing
		// init canvas
		this.canv.init();
		this.simulating = true;
		this.canv.setFps(this.fps);
		this.timer.play();
		$btn.text('stop');
	} else { // if playing
		this.simulating = false;
		this.timer.pause();
		$btn.text('start');
	}
};

$(function() {
    var apl = new panelApl();
});
