/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var Apl = function() {
	/* global var */
	// drag state
	this.drag = {
		now: false, // true if dragging
	};
	this.gamestart = false;  // true if playing

	// timer
	this.timer = $.timer();

	this.fps = 30;

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
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start);
	$btn.text('start');
};

Apl.prototype.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
	var $btn = $('#stbtn1'); // start button
	if (!this.gamestart) { // if not playing
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
		this.canv.setGravity(gravity);
		this.canv.setCor(cor);

		// add mouse events to the canvas
		$cvdiv.mousedown(this.cvmsDown.bind(this));
		$cvdiv.mouseup(this.cvmsUp.bind(this));
		$cvdiv.mouseleave(this.cvmsUp.bind(this));
		$cvdiv.mousemove(this.cvmsMove.bind(this));
		// add touch events to the canvas
		$cvdiv.bind("touchstart", this.cvmsDown.bind(this));
		$cvdiv.bind("touchend", this.cvmsUp.bind(this));
		$cvdiv.bind("touchend", this.cvmsUp.bind(this));
		$cvdiv.bind("touchmove", this.cvmsMove.bind(this));

		// init canvas
		this.canv.init();

		this.gamestart = true;
		this.canv.setFps(this.fps);

		this.timer.set({
			action: function() {
				this.canv.moveObj();
				this.canv.draw();
			}.bind(this),
			time: 1000/this.fps
		});

		this.timer.play();
		$btn.text('stop');
	} else { // if playing
		// delete mouse events from the canvas
		$cvdiv.unbind('mousedown', this.cvmsDown.bind(this));
		$cvdiv.unbind('mouseup', this.cvmsUp.bind(this));
		$cvdiv.unbind('mouseleave', this.cvmsUp.bind(this));
		$cvdiv.unbind('mousemove', this.cvmsMove.bind(this));
		// delete touch events from the canvas
		$cvdiv.unbind("touchstart", this.cvmsDown.bind(this));
		$cvdiv.unbind("touchend", this.cvmsUp.bind(this));
		$cvdiv.unbind("touchend", this.cvmsUp.bind(this));
		$cvdiv.unbind("touchmove", this.cvmsMove.bind(this));

		this.gamestart = false;
		this.timer.pause();
		$btn.text('start');
	}
};

Apl.prototype.cvmsDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - this.canv.cvpos.x;
	var cy = evt.pageY - this.canv.cvpos.y;
	this.drag.now = true;
	return false;
};

Apl.prototype.cvmsUp = function(evt) {
	if (this.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		if (cx < 0) cx = 0;
		if (cx > this.canv.area.w) cx = this.canv.area.w;
		if (cy < 0) cy = 0;
		if (cy > this.canv.area.h) cy = this.canv.area.h;

		this.drag.now = false;
	}
};

Apl.prototype.cvmsMove = function(evt) {
	if (this.drag.now) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		//this.canv.draw({x:cx, y:cy});
	}
	return false;
};

/* body onload process */
$(function() {
    var apl = new Apl();
});
