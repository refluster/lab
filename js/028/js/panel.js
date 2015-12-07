/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
    panelApl.gamestart = false;  // true if playing
    panelApl.fps = 10;
    panelApl.timer = $.timer();
    panelApl.acg = {x:3, y:4, z:5};

    // socket
    panelApl.socket = new io.connect("http://183.181.8.119:8028");

    // get my session id from the server
    panelApl.socket.on('your sid', function (sid) {
        console.log("my id %s", sid);
        panelApl.sessionId = sid;
    });

    panelApl.pos = {x:100, y:100};
    panelApl.speed = 4;
    panelApl.angle = 0;

    /* button process
     * return: none
     */
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
            panelApl.socket.on('set stear', function (data) {
                panelApl.stear = data.stear;
                console.log("stear %f", data.stear);

                panelApl.angle += data.stear/64;
                panelApl.pos.x += panelApl.speed*Math.sin(panelApl.angle);
                panelApl.pos.y += panelApl.speed*Math.cos(panelApl.angle);

                if (panelApl.pos.x > panelApl.canvas.width) {
                    panelApl.pos.x -= panelApl.canvas.width;
                }
                if (panelApl.pos.x < 0) {
                    panelApl.pos.x += panelApl.canvas.width;
                }
                if (panelApl.pos.y > panelApl.canvas.height) {
                    panelApl.pos.y -= panelApl.canvas.height;
                }
                if (panelApl.pos.y < 0) {
                    panelApl.pos.y += panelApl.canvas.height;
                }
                panelApl.pos.y += panelApl.speed*Math.cos(panelApl.angle);

                panelApl.canvMng.blank();
                panelApl.canvMng.draw({x:(data.stear + 10)*10, y:100}, "red");
//                panelApl.canvMng.draw({x:panelApl.pos.x, y:panelApl.pos.y}, "green");
            });

            // another client connected
            panelApl.socket.on('client connected', function (sid) {
                ;//
            });
            
            panelApl.socket.on('client disconnected', function (data) {
                ;//
            });
	} else { // if playing
	    panelApl.gamestart = false;
	    panelApl.showmsg('play display');
	}
    };

    panelApl.startController = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv

	if (!panelApl.gamestart) { // if not playing
            window.addEventListener('devicemotion', panelApl.getAcceleration);
	    panelApl.gamestart = true;
	    panelApl.showmsg('playing as controller');

            panelApl.socket.emit("set controller",
                                 {sid:panelApl.sessionId});
            
            panelApl.timer.set({
                action: function() {
                    console.log("hoge %d", panelApl.acg.y);
//                    panelApl.setStear(4);
                    panelApl.setStear(panelApl.acg.y);
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

    /* display message
     * {string} msg: displayed message
     * return: none
     */
    panelApl.showmsg = function(msg) {
	$('#msg1').html(msg);
    };
    
    // stearing setting
    panelApl.setStear = function(_stear) {
        panelApl.socket.emit("set stear",
                             {sid:panelApl.sessionId, stear:_stear});
    };

    // get acceleration
    panelApl.getAcceleration = function(evt) {
        panelApl.acg = evt.accelerationIncludingGravity;
    };

    /* body onload process */
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
	panelApl.showmsg('press start button');

    });
    
})(jQuery);
