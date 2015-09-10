var panelApl = function() {
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	var ctx = $canvas[0].getContext("2d");
	ctx.globalCompositeOperation = "source-over";

	// display
	this.canv = new canvasManager(ctx, $canvas.width(), $canvas.height());
	// set event
	var $btn = $('#btn1'); // start button
	$btn.mousedown(this.update.bind(this));
	$btn.text("update");

	setTimeout(this.update.bind(this), 1000);
};

panelApl.prototype.update = function() {
	var number = document.form1.input_number.value;
	var rmin = document.form1.input_rmin.value;
	var rmax = document.form1.input_rmax.value;
	var seconds = document.form1.input_seconds.value;;
	var fps = document.form1.input_fps.value;;

	// check if inputs are number
	if (isNaN(number) || isNaN(rmin) || isNaN(rmax) ||
		isNaN(seconds) || isNaN(fps)) {
		//this.showmsg("incorrect input");
		return;
	}

	number = Number(number);
	rmin = Number(rmin);
	rmax = Number(rmax);
	seconds = Number(seconds);
	fps = Number(fps);

	if (number < 0 || rmin < 0 || rmax < 0 || seconds < 0 || fps < 0) {
		//this.showmsg("values must be positive");
		return;
	}

	if (rmin > rmax) {
		//this.showmsg("rmax must be larger than rmin");
		return;
	}

	this.canv.init();

	var curNumber = 0;
	var incNumber = number/(seconds*fps);

	var addAndDraw = function() {
		this.canv.clearLeaf();
		if (curNumber + incNumber > number) {
			this.canv.addLeaf(number - curNumber, rmin, rmax);
		} else {
			setTimeout(addAndDraw, 1000/fps);
			this.canv.addLeaf(incNumber, rmin, rmax);
			curNumber += incNumber;
		}
		this.canv.draw();
	}.bind(this);

	var timer = setTimeout(addAndDraw, 50);
};

$(function() {
	var apl = new panelApl();
});
