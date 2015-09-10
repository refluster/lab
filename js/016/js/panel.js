/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = function() {
	// display message
	// {string} msg: displayed message
	// return: none
	this.text = $("#txt1");
	this.number; // the number of leaves
	this.rmin; // min radius of leaves
	this.rmax; // max radius of leaves

		console.log("window.load");

		// get canvas's DOM element and context
		var canvas = document.getElementById('canvas');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.globalCompositeOperation = "source-over";

		// display
		this.canv = new canvasManager.canv(ctx, canvas.width,
											   canvas.height, this);
		// set event
		var $btn = $('#btn1'); // start button
		$btn.mousedown(this.update.bind(this));
		$btn.text("update");

		setTimeout(this.update.bind(this), 1000);

		// update by initial parameter
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

		this.number = number;
		this.rmin = rmin;
		this.rmax = rmax;

		this.canv.init();

		//this.canv.addLeaf(number, rmin, rmax);
		//this.canv.draw();

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

		var timer = setTimeout(addAndDraw, 50);//1000/fps);
};

$(function() {
	var apl = new panelApl();
});

