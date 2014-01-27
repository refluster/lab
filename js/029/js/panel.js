/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
    panelApl.gamestart = false;  // true if playing
    panelApl.fps = 10;
    panelApl.timer = $.timer();
    panelApl.acc = {x:0, y:0, z:0};
    panelApl.pos = {x:100, y:100, z:100};
    panelApl.vec = {x:100, y:100, z:100};
    panelApl.angle = {x:0, y:0, z:0};
    
    // socket
    panelApl.socket = new io.connect("http://183.181.8.119:8029");

    // get my session id from the server
    panelApl.socket.on('your sid', function (sid) {
        console.log("my id %s", sid);
        panelApl.sessionId = sid;
    });

    // display device (normally pc) entry point
    panelApl.startDisplay = function() {
	if (!panelApl.gamestart) { // if not playing
	    // init canvas
	    panelApl.canvMng.init();
	    panelApl.gamestart = true;
	    panelApl.showmsg('playing as display');

            panelApl.socket.emit("set display", {sid:panelApl.sessionId});

            // socket event bind
            panelApl.socket.on("connect", function(){
                console.log('connected');
            });
            
            // draw line by another client
            panelApl.socket.on('send sensor', function (data) {
                var acc = data.acc;
                var interval = data.interval;

                console.log("sensor recv");
                panelApl.vec.x += acc.x*interval;
                panelApl.vec.y += acc.y*interval;
                panelApl.vec.z += acc.z*interval;

                panelApl.pos.x += panelApl.vec.x*interval;
                panelApl.pos.y += panelApl.vec.y*interval;
                panelApl.pos.z += panelApl.vec.z*interval;

                console.log("v(%8d,%8d) p(%8d,%8d)",
                            panelApl.vec.x, panelApl.vec.y,
                            panelApl.pos.x, panelApl.pos.y);
                panelApl.canvMng.blank();
                panelApl.canvMng.draw({x:panelApl.pos.x, y:100}, "red");
            });

            // another client connected
            panelApl.socket.on('client connected', function (sid) {
                ;//
            });
            
            // a client disconnected
            panelApl.socket.on('client disconnected', function (data) {
                ;//
            });
	} else { // if playing
	    panelApl.gamestart = false;
	    panelApl.showmsg('play display');
	}
    };

    // mobile controller entry point
    panelApl.startController = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv

	if (!panelApl.gamestart) { // if not playing
            window.addEventListener('devicemotion', panelApl.deviceMotion);
            //window.addEventListener('deviceorientation', panelApl.deviceOrientation;
	    panelApl.gamestart = true;
	    panelApl.showmsg('playing as controller');
            
            panelApl.socket.emit("set controller",
                                 {sid:panelApl.sessionId});
            
            // run on each frame
            panelApl.timer.set({
                action: function() {
                    console.log("send sensor params");
                    panelApl.sendSensor();
                },
                time: 1000/panelApl.fps
            });
            panelApl.timer.play();

	} else { // if playing
	    panelApl.gamestart = false;
	    panelApl.showmsg('play controller');
            panelApl.timer.pause();
	}
    };

    // display message
    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };
    
    // send sensor (client)
    panelApl.sendSensor = function() {
        panelApl.socket.emit("send sensor",
                             {sid:panelApl.sessionId,
                              acc:panelApl.acc,
                              interval:1000/panelApl.fps});
        panelApl.acc.x = panelApl.acc.y = panelApl.acc.z = 0;
    };
    
    // get acceleration (client)
    panelApl.deviceMotion = function(evt) {
        var acc = evt.acceleration;
        panelApl.acc.x += acc.x;
        panelApl.acc.y += acc.y;
        panelApl.acc.z += acc.z;
        //http://docs.phonegap.com/ja/3.1.0/cordova_accelerometer_accelerometer.md.html
    };
    
    // onload process
    $(window).load(function() {
	// get canvas's DOM element and context
	panelApl.canvas = document.getElementById('cv1');
	if ( ! panelApl.canvas || ! panelApl.canvas.getContext ) { return false; }
	var ctx = panelApl.canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
        
	// canvas
	panelApl.canvMng = new canvasManager.canv(ctx, panelApl.canvas.width,
                                                  panelApl.canvas.height,
                                                  panelApl);
	panelApl.canvMng.init();
	panelApl.canvMng.draw({x:0, y:0});
        
	// set events
	$('#stbtn_pc').mousedown(panelApl.startDisplay);
        $('#stbtn_smapho').mousedown(panelApl.startController);
        
	// show message
	panelApl.showmsg('press display or mobile');
    });
})(jQuery);
