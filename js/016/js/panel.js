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
    
    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };

    panelApl.update = function() {
	console.log("update");
	var number = document.form1.input_number.value;
	var rmin = document.form1.input_rmin.value;
	var rmax = document.form1.input_rmax.value;
	var seconds = document.form1.input_seconds.value;;
	var fps = document.form1.input_fps.value;;

	// check if inputs are number
	if (isNaN(number) || isNaN(rmin) || isNaN(rmax) ||
	    isNaN(seconds) || isNaN(fps)) {
	    panelApl.showmsg("incorrect input");
	    return;
	}
	
	number = Number(number);
	rmin = Number(rmin);
	rmax = Number(rmax);
	seconds = Number(seconds);
	fps = Number(fps);
	
	if (number < 0 || rmin < 0 || rmax < 0 || seconds < 0 || fps < 0) {
	    panelApl.showmsg("values must be positive");
	    return;
	}	    

	if (rmin > rmax) {
	    panelApl.showmsg("rmax must be larger than rmin");
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
	var canvas = document.getElementById('cv1');
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

/*
  ///// FOR DRAG USE

    // mousedown process
    // {event} evt: event obj
    // return: none
    panelApl.cvmsDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - panelApl.canv.cvpos.x;
	var cy = evt.pageY - panelApl.canv.cvpos.y;
	panelApl.drag.now = true;
        panelApl.showmsg("");
	return false;
    };
    // mouseup/mouseleave process
    // {event} evt: event obj
    // return: none
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
    // mousemove process
    // {event} evt: evnet obj
    // return: none
    panelApl.cvmsMove = function(evt) {
	if (panelApl.drag.now) {
	    // convert coordinate from point to canvas
	    var cx = evt.pageX - panelApl.canv.cvpos.x;
	    var cy = evt.pageY - panelApl.canv.cvpos.y;
	}
	return false;
    };

    panelApl.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
	var $btn = $('#btn1'); // start button
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
*/
