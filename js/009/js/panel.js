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
    
    // socket
    panelApl.socket = new io.connect("http://183.181.8.119:8081");

    // server side session id
    panelApl.sessionId = null;

    // client database, [0] indicates self
    panelApl.client_db = new Array();

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
	    panelApl.canvMng.init();
	    
	    panelApl.gamestart = true;
	    panelApl.showmsg('drawable');
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
	    panelApl.showmsg('press start button');
	    $btn.text('start');
	}

    };

    panelApl.saveImage = function() {
        var imgData = panelApl.canvas.toDataURL();
//        var imgData = panelApl.canvas.readAsBinaryString();
        panelApl.socket.emit('saveImage', {imgData:imgData});
    };
    
    panelApl.restoreImage = function() {
        panelApl.socket.emit('restoreImage');
    };

    panelApl.clearImage = function() {
        panelApl.socket.emit('clearImage');
        panelApl.canvMng.blank();
    };

    panelApl.displayImage = function() {
        var imgData = panelApl.canvas.toDataURL();

        window.open(imgData);
    };

    panelApl.downloadImage = function() {
        var data = panelApl.canvas.toDataURL().
            replace('image/png', 'application/octet-stream');;
        location.href = data;
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
	var cx = evt.pageX - panelApl.canvMng.cvpos.x;
	var cy = evt.pageY - panelApl.canvMng.cvpos.y;
	panelApl.drag.now = true;

//	panelApl.canvMng.setPos({x:cx, y:cy});
        panelApl.client_db[0].prevPos = {x:cx, y:cy};
        panelApl.socket.emit('setPos', {sid:panelApl.sessionId, to:{x:cx, y:cy}});
        panelApl.showmsg("drawing");
	return false;
    };
    /* mouseup/mouseleave process
     * {event} evt: event obj
     * return: none
     */
    panelApl.cvmsUp = function(evt) {
	if (panelApl.drag.now) {
	    // convert coordinate from point to canvas
	    var cx = evt.pageX - panelApl.canvMng.cvpos.x;
	    var cy = evt.pageY - panelApl.canvMng.cvpos.y;
	    if (cx < 0) cx = 0;
	    if (cx > panelApl.canvMng.area.w) cx = panelApl.canvMng.area.w;
	    if (cy < 0) cy = 0;
	    if (cy > panelApl.canvMng.area.h) cy = panelApl.canvMng.area.h;
	    
	    panelApl.drag.now = false;
	    if (evt.type == 'mouseleave'){
		panelApl.showmsg('dropped due to out of canvas');
	    } else if (panelApl.gamestart) {
		panelApl.showmsg('movable');
	    }
	}
        
        panelApl.showmsg("drawable");
    };
    /* mousemove process
     * {event} evt: evnet obj
     * return: none
     */
    panelApl.cvmsMove = function(evt) {
	if (panelApl.drag.now) {
	    // convert coordinate from point to canvas
	    var cx = evt.pageX - panelApl.canvMng.cvpos.x;
	    var cy = evt.pageY - panelApl.canvMng.cvpos.y;
	    // check if the canvas should be updated
	    var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
            var conf = panelApl.client_db[0];

	    // update the canvas
            panelApl.canvMng.setColor(conf.color);
            panelApl.canvMng.setLineWidth(conf.lineWidth);
            panelApl.canvMng.setPos(conf.prevPos);
	    panelApl.canvMng.draw({x:cx, y:cy});
            conf.prevPos = {x:cx, y:cy};
            panelApl.socket.emit('drawLine', {sid:panelApl.sessionId, to:{x:cx, y:cy}});
//            console.log('drawLine(%d,%d)', cx, cy);
        }
	return false;
    };
    
    // color setting
    panelApl.setColor = function(_color) {
        //panelApl.canvMng.setColor(_color);
        panelApl.client_db[0].color = _color;
        panelApl.socket.emit("setColor", {sid:panelApl.sessionId, color:_color});
    };
    panelApl.setColorBlack = function() {
        panelApl.setColor('black');
    };
    panelApl.setColorRed = function() {
        panelApl.setColor('red');
    };
    panelApl.setColorBlue = function() {
        panelApl.setColor('blue');
    };
    panelApl.setColorYellow = function() {
        panelApl.setColor('yellow');
    };

    // line width setting
    panelApl.setLineWidth = function(_lineWidth) {
        //panelApl.canvMng.setLineWidth(_lineWidth);
        panelApl.client_db[0].lineWidth = _lineWidth;
        panelApl.socket.emit("setLineWidth", {sid:panelApl.sessionId, lineWidth:_lineWidth});
    };
    panelApl.setLineWidth1px = function() {
        panelApl.setLineWidth(1);
    };
    panelApl.setLineWidth3px = function() {
        panelApl.setLineWidth(3);
    };
    panelApl.setLineWidth5px = function() {
        panelApl.setLineWidth(5);
    };

    /* body onload process */
    $(window).load(function() {
	// get canvas's DOM element and context
	panelApl.canvas = document.getElementById('cv1');
	if ( ! panelApl.canvas || ! panelApl.canvas.getContext ) { return false; }
	var ctx = panelApl.canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalAlpha = 0.7;
	ctx.globalCompositeOperation = "source-over";

	// display
	panelApl.canvMng = new canvasManager.canv(ctx, panelApl.canvas.width,
                                                  panelApl.canvas.height, panelApl);
	panelApl.canvMng.init();
	panelApl.canvMng.draw({x:0, y:0});

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(panelApl.start);
	$btn.text('start');

        var $savebtn = $('#savebtn');
	$savebtn.mousedown(panelApl.saveImage);
	$savebtn.text('save image');
        
        var $restorebtn = $('#restorebtn');
	$restorebtn.mousedown(panelApl.restoreImage);
	$restorebtn.text('restore image');

        var $clearbtn = $('#clearbtn');
	$clearbtn.mousedown(panelApl.clearImage);
	$clearbtn.text('clear image');
        
        var $dispimgbtn = $('#dispimgbtn');
	$dispimgbtn.mousedown(panelApl.displayImage);
	$dispimgbtn.text('display image');
        
        var $dlimgbtn = $('#dlimgbtn');
	$dlimgbtn.mousedown(panelApl.downloadImage);
	$dlimgbtn.text('download image');
        
	// show message
	panelApl.showmsg('press start button');

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

        // socket event bind
        panelApl.socket.on("connect", function(){
            //$("#transportName").text("connect via " + socket.socket.transport.name);
            console.log('connected');
        });
        
        panelApl.socket.on("message", function(data){
            var date = new Date;
            var li = $("<li>");
            li.html(li.text(data.message).html() 
                    + '<small style="margin-left:30px;color:#a0a0a0"> by '
                    + data.name + ' at ' + date.toString() + '</small>');
            li.prependTo($("#messageArea ul"));
        });
        
        // draw line by another client
        panelApl.socket.on('setPos', function (data) {
//	    panelApl.canvMng.setPos({x:data.x, y:data.y});
            panelApl.client_db[data.sid].prevPos = data.to;
        });

        // draw line by another client
        panelApl.socket.on('setColor', function (data) {
//	    panelApl.canvMng.setColor(data.color);
            panelApl.client_db[data.sid].color = data.color;
        });

        // draw line by another client
        panelApl.socket.on('setLineWidth', function (data) {
//	    panelApl.canvMng.setLineWidth(data.lineWidth);
            panelApl.client_db[data.sid].lineWidth = data.lineWidth;
        });

        // draw line by another client
        panelApl.socket.on('drawLine', function (data) {
            var conf = panelApl.client_db[data.sid];
            
	    panelApl.canvMng.setPos({x:conf.prevPos.x, y:conf.prevPos.y});
	    panelApl.canvMng.setColor(conf.color);
	    panelApl.canvMng.setLineWidth(conf.lineWidth);
	    panelApl.canvMng.draw({x:data.to.x, y:data.to.y});
            conf.prevPos = data.to
        });

        // get my session id from the server
        panelApl.socket.on('your sid', function (sid) {
            console.log("session id: %d", sid);
            panelApl.sessionId = sid;
            panelApl.client_db[0] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
        });
        
        // another client connected
        panelApl.socket.on('client connected', function (sid) {
            panelApl.client_db[sid] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
        });
        
        panelApl.socket.on('client disconnected', function (data) {
            //jQuery('#member_count').html(data);
        });
        
        panelApl.socket.on('restore image', function(data) {
            panelApl.canvMng.restoreImage(data);
        });

        panelApl.socket.on('clear image', function(data) {
            panelApl.canvMng.blank();
        });
        
    });
    
})(jQuery);
