/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
	panelApl.start = false;  // true if playing
	panelApl.timer = $.timer();
	panelApl.fps = 30;

	/* button process
	 * return: none
	 */
	panelApl.start = function() {
		var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
		var $btn = $('#stbtn1'); // start button

		if (!panelApl.start) { // if not playing
			// init canvas
			panelApl.canv.init();
			panelApl.start = true;
			panelApl.canv.setFps(panelApl.fps);
			panelApl.showmsg('moving');
			panelApl.timer.play();
			$btn.text('stop');
		} else { // if playing
			panelApl.start = false;
			panelApl.timer.pause();
			panelApl.showmsg('paused');
			$btn.text('start');
		}
	};

	panelApl.showmsg = function(msg) {
		$('#msg1').html(msg);
	};

	/* body onload process */
	$(window).load(function() {
		// get canvas's DOM element and context
		var canvas = document.getElementById('cv1');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");

		// canvas
		panelApl.canv = new canvasManager.canv(ctx, canvas.width,
											   canvas.height);
		panelApl.canv.init();
		panelApl.canv.draw();

		// set events
		var $btn = $('#stbtn1'); // start button
		$btn.mousedown(panelApl.start);
		$btn.text('start');

		// show message
		panelApl.showmsg('press start button');
		window.addEventListener('devicemotion', panelApl.readGravity);

		panelApl.timer.set({
			action: function() {
				panelApl.canv.moveObj();
				panelApl.canv.draw();
			},
			time: 1000/panelApl.fps
		});

	});
})(jQuery);
