var Apl = function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('cv1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";

	// display
	this.canv = new canvasManager.canv(ctx, canvas.width,
										   canvas.height, this);
	this.canv.init();
	this.canv.draw();

	// set events
	$('#stbtn1').mousedown(this.start.bind(this));

	this.timer = $.timer();
};

Apl.prototype.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv

	// set parameters from web form
	var gravity = document.form1.input_gravity.value;
	var fps = document.form1.input_fps.value;
	// check if inputs are number
	if (isNaN(gravity) || isNaN(fps)) {
		return;
	}
	gravity = Number(gravity);
	fps = Number(fps);
	if (gravity < 0 || fps < 0) {
		return;
	}
	this.canv.setGravity(gravity);
	this.canv.setFps(fps);

	// init canvas
	this.canv.init();

	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.draw();
		}.bind(this),
		time: 1000/fps
	});

	this.timer.play();
};

$(function() {
    var apl = new Apl();
});
