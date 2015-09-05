var panelApl = {};

(function($) {
	panelApl.dragging = false;
	panelApl.timer = $.timer();

	panelApl.start = function() {
		var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
		// add mouse events to the canvas
		$cvdiv.mousedown(panelApl.cvmsDown);
		$cvdiv.mouseup(panelApl.cvmsUp);
		$cvdiv.mouseleave(panelApl.cvmsUp);
		$cvdiv.mousemove(panelApl.cvmsMove);
		// add touch events to the canvas
		$cvdiv.bind("touchstart", panelApl.cvmsDown);
		$cvdiv.bind("touchend", panelApl.cvmsUp);
		$cvdiv.bind("touchend", panelApl.cvmsUp);
		$cvdiv.bind("touchmove", panelApl.cvmsMove);
		
		// init canvas
		panelApl.canv.init();

		// init timer
		panelApl.timer.play();
	};

	panelApl.cvmsDown = function(evt) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.canv.cvpos.x;
		var cy = evt.pageY - panelApl.canv.cvpos.y;
		panelApl.dragging = true;
		return false;
	};
	panelApl.cvmsUp = function(evt) {
		if (panelApl.dragging == true) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
			if (cx < 0) cx = 0;
			if (cx > panelApl.canv.area.w) cx = panelApl.canv.area.w;
			if (cy < 0) cy = 0;
			if (cy > panelApl.canv.area.h) cy = panelApl.canv.area.h;

			panelApl.dragging = false;
		}
	};
	panelApl.cvmsMove = function(evt) {
		if (panelApl.dragging == true) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
			// check if the canvas should be updated
			var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
			// update the canvas
			panelApl.canv.moveTo({x:cx, y:cy});
			panelApl.timer.play();
		}
		return false;
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
		panelApl.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
		panelApl.canv.init();
		panelApl.canv.draw();

		panelApl.timer.set({
			action: function() {
				panelApl.canv.moveObj();
				panelApl.canv.draw();

				if (!panelApl.canv.needToUpdate()) {
					panelApl.timer.pause();
				}
			},
			time: 60
		});

		panelApl.start();

	});
})(jQuery);
