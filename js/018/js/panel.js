/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {

    /* global var */
    // drag state
    panelApl.drag = {
		now: false, // true if dragging
    };
    panelApl.gamestart = false;  // true if playing

    // timer
    panelApl.timer = $.timer();

    /* button process
     * return: none
     */
    panelApl.start = function() {
		var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
		var $btn = $('#stbtn1'); // start button
		if (!panelApl.gamestart) { // if not playing
            //// set parameters from web form
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

			panelApl.gamestart = true;


            panelApl.timer.set({
                action: function() {
                    panelApl.canv.moveObj();
                    panelApl.canv.draw();
                },
                time: 1000/fps
            });

            panelApl.timer.play();
			$btn.text('stop');
		} else { // if playing
			// delete mouse events from the canvas
			$cvdiv.unbind('mousedown', panelApl.cvmsDown);
			$cvdiv.unbind('mouseup', panelApl.cvmsUp);
			$cvdiv.unbind('mouseleave', panelApl.cvmsUp);
			$cvdiv.unbind('mousemove', panelApl.cvmsMove);
			// delete touch events from the canvas
			$cvdiv.unbind("touchstart", panelApl.cvmsDown);
			$cvdiv.unbind("touchend", panelApl.cvmsUp);
			$cvdiv.unbind("touchend", panelApl.cvmsUp);
			$cvdiv.unbind("touchmove", panelApl.cvmsMove);

			panelApl.gamestart = false;
            panelApl.timer.pause();
			$btn.text('start');
		}
    };

    panelApl.cvmsDown = function(evt) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - panelApl.canv.cvpos.x;
		var cy = evt.pageY - panelApl.canv.cvpos.y;
		panelApl.drag.now = true;
		return false;
    };

    panelApl.cvmsUp = function(evt) {
		if (panelApl.drag.now) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
			if (cx < 0) cx = 0;
			if (cx > panelApl.canv.area.w) cx = panelApl.canv.area.w;
			if (cy < 0) cy = 0;
			if (cy > panelApl.canv.area.h) cy = panelApl.canv.area.h;

			panelApl.drag.now = false;
		}
    };

    panelApl.cvmsMove = function(evt) {
		if (panelApl.drag.now) {
			// convert coordinate from point to canvas
			var cx = evt.pageX - panelApl.canv.cvpos.x;
			var cy = evt.pageY - panelApl.canv.cvpos.y;
            //panelApl.canv.draw({x:cx, y:cy});
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
		panelApl.canv = new canvasManager.canv(ctx, canvas.width,
                                               canvas.height, panelApl);
		panelApl.canv.init();
		panelApl.canv.draw();
        
		// set events
		var $btn = $('#stbtn1'); // start button
		$btn.mousedown(panelApl.start);
		$btn.text('start');
    });
})(jQuery);
