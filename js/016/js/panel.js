/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
	// display message
	// {string} msg: displayed message
	// return: none
	panelApl.text = $("#txt1");
	panelApl.number; // the number of leaves
	panelApl.rmin; // min radius of leaves
	panelApl.rmax; // max radius of leaves

	panelApl.update = function() {
		var number = document.form1.input_number.value;
		var rmin = document.form1.input_rmin.value;
		var rmax = document.form1.input_rmax.value;
		var seconds = document.form1.input_seconds.value;;
		var fps = document.form1.input_fps.value;;

		// check if inputs are number
		if (isNaN(number) || isNaN(rmin) || isNaN(rmax) ||
			isNaN(seconds) || isNaN(fps)) {
			//panelApl.showmsg("incorrect input");
			return;
		}

		number = Number(number);
		rmin = Number(rmin);
		rmax = Number(rmax);
		seconds = Number(seconds);
		fps = Number(fps);

		if (number < 0 || rmin < 0 || rmax < 0 || seconds < 0 || fps < 0) {
			//panelApl.showmsg("values must be positive");
			return;
		}

		if (rmin > rmax) {
			//panelApl.showmsg("rmax must be larger than rmin");
			return;
		}

		panelApl.number = number;
		panelApl.rmin = rmin;
		panelApl.rmax = rmax;

		panelApl.canv.init();

		//panelApl.canv.addLeaf(number, rmin, rmax);
		//panelApl.canv.draw();

		var curNumber = 0;
		var incNumber = number/(seconds*fps);

		var addAndDraw = function() {
			panelApl.canv.clearLeaf();
			if (curNumber + incNumber > number) {
				panelApl.canv.addLeaf(number - curNumber, rmin, rmax);
			} else {
				setTimeout(addAndDraw, 1000/fps);
				panelApl.canv.addLeaf(incNumber, rmin, rmax);
				curNumber += incNumber;
			}
			panelApl.canv.draw();
		};

		var timer = setTimeout(addAndDraw, 50);//1000/fps);
	};

	/* body onload process */
	$(window).load(function() {
		console.log("window.load");

		// get canvas's DOM element and context
		var canvas = document.getElementById('canvas');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.globalCompositeOperation = "source-over";

		// display
		panelApl.canv = new canvasManager.canv(ctx, canvas.width,
											   canvas.height, panelApl);
		// set event
		var $btn = $('#btn1'); // start button
		$btn.mousedown(panelApl.update);
		$btn.text("update");

		setTimeout(panelApl.update(), 1000);

		// update by initial parameter

	});
})(jQuery);

