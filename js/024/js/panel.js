/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {

    /* global var */
    panelApl.gamestart = false;  // true if playing

    panelApl.dragging;  // true if dragging

    // timer
    panelApl.timer = $.timer();

    /* button process
     * return: none
     */
    panelApl.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas��div
	var $btn = $('#stbtn1'); // start button
	if (!panelApl.gamestart) { // if not playing
            /*
            //// set parameters from web form
            var gravity = document.form1.input_gravity.value;
            var fps = document.form1.input_fps.value;
            // check if inputs are number
            if (isNaN(gravity) || isNaN(fps)) {
                panelApl.showmsg("ERROR: incorrect input");
                return;
            }
            gravity = Number(gravity);
            fps = Number(fps);
            if (gravity < 0 || fps < 0) {
                panelApl.showmsg("ERROR: values must be zero or positive numbers");
                return;
            }
//            panelApl.canv.setGravity(gravity);
//            panelApl.canv.setFps(fps);
*/

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
                    panelApl.canv.update();
                    panelApl.canv.draw();
                },
                time: 50
            });

            panelApl.timer.play();
	    panelApl.showmsg('moving');
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
	    panelApl.showmsg('paused');
	    $btn.text('start');
	}
    };

    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };

    panelApl.cvmsDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - panelApl.canv.cvpos.x;
	var cy = evt.pageY - panelApl.canv.cvpos.y;
	panelApl.dragging = true;
        panelApl.canv.setPos(cx, cy);
	return false;
    };

    panelApl.cvmsUp = function(evt) {
	if (panelApl.dragging) {
	    // convert coordinate from point to canvas
	    var cx = evt.pageX - panelApl.canv.cvpos.x;
	    var cy = evt.pageY - panelApl.canv.cvpos.y;
	    if (cx < 0) cx = 0;
	    if (cx > panelApl.canv.area.w) cx = panelApl.canv.area.w;
	    if (cy < 0) cy = 0;
	    if (cy > panelApl.canv.area.h) cy = panelApl.canv.area.h;
	    
	    panelApl.dragging = false;
            panelApl.canv.setPos(cx, cy);
	    if (evt.type == 'mouseleave'){
                ;//panelApl.showmsg('dropped due to out of canvas');
	    } else if (panelApl.gamestart) {
		;//panelApl.showmsg('movable');
	    }
	}
    };

    panelApl.cvmsMove = function(evt) {
	if (panelApl.dragging) {
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
	
	// show message
	panelApl.showmsg('press start button');
    });
})(jQuery);
