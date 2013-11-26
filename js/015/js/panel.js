/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {

    /* global var */
    // drag state
    panelApl.drag = {
	now: false, // true if dragging
        idx: null // index of dragged item
    };
    panelApl.gamestart = false;  // true if playing

    /* button process
     * return: none
     */
    panelApl.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
	var $btn = $('#stbtn1'); // start button
	if (!panelApl.gamestart) { // if not playing
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
	    panelApl.showmsg('');
	    $btn.text('');
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
	    panelApl.showmsg('');
	    $btn.text('');
	}
    };

    /* display message
     * {string} msg: displayed message
     * return: none
     */
    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };

    /* mousedown process
     * {event} evt: event obj
     * return: none
     */
    panelApl.cvmsDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - panelApl.canv.cvpos.x;
	var cy = evt.pageY - panelApl.canv.cvpos.y;
	panelApl.drag.now = true;
        panelApl.showmsg("");
	return false;
    };
    /* mouseup/mouseleave process
     * {event} evt: event obj
     * return: none
     */
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
	    if (evt.type == 'mouseleave'){
                panelApl.showmsg('');
	    } else if (panelApl.gamestart) {
		panelApl.showmsg('');
	    }
	}
    };
    /* mousemove process
     * {event} evt: evnet obj
     * return: none
     */
    panelApl.cvmsMove = function(evt) {
	if (panelApl.drag.now) {
	    // convert coordinate from point to canvas
	    var cx = evt.pageX - panelApl.canv.cvpos.x;
	    var cy = evt.pageY - panelApl.canv.cvpos.y;
	}
	return false;
    };

    /* body onload process */
    $(window).load(function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('cv1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.globalCompositeOperation = "source-over";

	// display
	panelApl.canv = new canvasManager.canv(ctx, canvas.width,
                                               canvas.height, panelApl);
	panelApl.canv.init();
	panelApl.canv.draw();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(panelApl.start);
	$btn.text('');
	
	// show message
	panelApl.showmsg('');
    });


})(jQuery);
