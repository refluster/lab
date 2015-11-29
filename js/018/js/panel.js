/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
	// timer
	panelApl.timer = $.timer();

	/* button process
	 * return: none
	 */
	panelApl.start = function() {
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
		panelApl.canv.setGravity(gravity);
		panelApl.canv.setFps(fps);

		// init canvas
		panelApl.canv.init();

		panelApl.timer.set({
			action: function() {
				panelApl.canv.moveObj();
				panelApl.canv.draw();
			},
			time: 1000/fps
		});

		panelApl.timer.play();
	};

	/* body onload process */
	$(window).load(function() {
		// get canvas's DOM element and context
		var canvas = document.getElementById('cv1');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = "source-over";

		// display
		panelApl.canv = new canvasManager.canv(ctx, canvas.width,
											   canvas.height, panelApl);
		panelApl.canv.init();
		panelApl.canv.draw();

		// set events
		var $btn = $('#stbtn1'); // start button
		$btn.mousedown(panelApl.start);
		$btn.text('update');
	});
})(jQuery);
