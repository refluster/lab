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

    panelApl.prevPos = {x:0, y:0}; // previous position

    /* button process
     * return: none
     */
    panelApl.start = function() {
		var $canvas = $('#cv1'); // main Canvas¤Îdiv
		
		// add mouse events to the canvas
		$canvas.mousedown(panelApl.cvmsDown);
		$canvas.mouseup(panelApl.cvmsUp);
		$canvas.mouseleave(panelApl.cvmsUp);
		$canvas.mousemove(panelApl.cvmsMove);
		// add touch events to the canvas
		$canvas.bind("touchstart", panelApl.cvmsDown);
		$canvas.bind("touchend", panelApl.cvmsUp);
		$canvas.bind("touchend", panelApl.cvmsUp);
		$canvas.bind("touchmove", panelApl.cvmsMove);
		// init canvas
		panelApl.canv.init();
			
		panelApl.gamestart = true;
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
		panelApl.canv.setPos({x:cx, y:cy});
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
			// check if the canvas should be updated
			var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
			// update the canvas
			panelApl.canv.draw({x:cx, y:cy});
		}
		return false;
    };

    // color setting
    panelApl.setColorBlack = function() {
        panelApl.canv.setColor('black');
    };
    panelApl.setColorRed = function() {
        panelApl.canv.setColor('red');
    };
    panelApl.setColorBlue = function() {
        panelApl.canv.setColor('blue');
    };
    panelApl.setColorYellow = function() {
        panelApl.canv.setColor('yellow');
    };
    panelApl.setLineWidth1px = function() {
        panelApl.canv.setLineWidth(1);
    };
    panelApl.setLineWidth3px = function() {
        panelApl.canv.setLineWidth(3);
    };
    panelApl.setLineWidth5px = function() {
        panelApl.canv.setLineWidth(5);
    };


    /* body onload process */
    $(window).load(function() {
		// get canvas's DOM element and context
		var canvas = document.getElementById('cv1');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.7;
		ctx.globalCompositeOperation = "source-over";

		// display
		panelApl.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
		panelApl.canv.init();
		panelApl.canv.draw({x:0, y:0});

		// init
		panelApl.start();
		
        // set bottun events
        $('#color-black').bind('touchstart', panelApl.setColorBlack);
        $('#color-black').bind('mousedown', panelApl.setColorBlack);
        $('#color-red').bind('touchstart', panelApl.setColorRed);
        $('#color-red').bind('mousedown', panelApl.setColorRed);
        $('#color-blue').bind('touchstart', panelApl.setColorBlue);
        $('#color-blue').bind('mousedown', panelApl.setColorBlue);
        $('#color-yellow').bind('touchstart', panelApl.setColorYellow);
        $('#color-yellow').bind('mousedown', panelApl.setColorYellow);
        $('#line-1px').bind('touchstart', panelApl.setLineWidth1px);
        $('#line-1px').bind('mousedown', panelApl.setLineWidth1px);
        $('#line-3px').bind('touchstart', panelApl.setLineWidth3px);
        $('#line-3px').bind('mousedown', panelApl.setLineWidth3px);
        $('#line-5px').bind('touchstart', panelApl.setLineWidth5px);
        $('#line-5px').bind('mousedown', panelApl.setLineWidth5px);
    });


})(jQuery);
