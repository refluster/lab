var client = {}; // namespace

(function($) {
	// drag state
	client.dragging = false;

	// running state
	client.run = false;

	// socket
	//client.socket = new io.connect("http://183.181.8.119:8081");
	client.socket = new io.connect("http://localhost:8081");

	// my session id
	client.sessionId = null;

	// client database, [0] is mine
	client.client_db = new Array();

	// display message
	client.showmsg = function(msg) {
		$('#msg1').html(msg);
	};

	// button function: start
	client.start = function() {
		var $cvdiv = $('#cvdiv1');
		var $btn = $('#stbtn1');
		if (!client.run) {
			// bind mouse/touch events
			$cvdiv.mousedown(client.cvmsDown);
			$cvdiv.mouseup(client.cvmsUp);
			$cvdiv.mouseleave(client.cvmsUp);
			$cvdiv.mousemove(client.cvmsMove);
			$cvdiv.bind("touchstart", client.cvmsDown);
			$cvdiv.bind("touchend", client.cvmsUp);
			$cvdiv.bind("touchend", client.cvmsUp);
			$cvdiv.bind("touchmove", client.cvmsMove);

			client.run = true;
			client.showmsg('drawable');
			$btn.text('stop');
		} else {
			// unbind mouse/touch events
			$cvdiv.unbind('mousedown', client.cvmsDown);
			$cvdiv.unbind('mouseup', client.cvmsUp);
			$cvdiv.unbind('mouseleave', client.cvmsUp);
			$cvdiv.unbind('mousemove', client.cvmsMove);
			$cvdiv.unbind("touchstart", client.cvmsDown);
			$cvdiv.unbind("touchend", client.cvmsUp);
			$cvdiv.unbind("touchend", client.cvmsUp);
			$cvdiv.unbind("touchmove", client.cvmsMove);

			client.run = false;
			client.showmsg('press start button');
			$btn.text('start');
		}
	};

	// button function: save image
	client.saveImage = function() {
		var imgData = client.canvas.toDataURL();
		client.socket.emit('saveImage', {imgData:imgData});
	};

	// button function: restore image
	client.restoreImage = function() {
		client.socket.emit('restoreImage');
	};

	// button function: clear image
	client.clearImage = function() {
		client.socket.emit('clearImage');
		client.canvMng.blank();
	};

	// button function: display image
	client.displayImage = function() {
		var imgData = client.canvas.toDataURL();

		window.open(imgData);
	};

	// button function: download image
	client.downloadImage = function() {
		var data = client.canvas.toDataURL().
			replace('image/png', 'application/octet-stream');;
		location.href = data;
	};

	// mousedown event
	client.cvmsDown = function(evt) {
		var cx = evt.pageX - client.cvpos.x;
		var cy = evt.pageY - client.cvpos.y;

		client.dragging = true;
		client.client_db[0].prevPos = {x:cx, y:cy};
		client.socket.emit('setPos', {sid:client.sessionId,
									  to:{x:cx, y:cy}});
		client.showmsg("drawing");
		return false;
	};

	// mouseup/mouseleave event
	client.cvmsUp = function(evt) {
		client.dragging = false;
		client.showmsg("drawable");
	};

	// mousemove event
	client.cvmsMove = function(evt) {
		if (!client.dragging) {
			return false;
		}
		var cx = evt.pageX - client.cvpos.x;
		var cy = evt.pageY - client.cvpos.y;
		var conf = client.client_db[0];

		// update the canvas
		client.canvMng.setColor(conf.color);
		client.canvMng.setLineWidth(conf.lineWidth);
		client.canvMng.setPos(conf.prevPos);

		client.canvMng.draw({x:cx, y:cy});
		conf.prevPos = {x:cx, y:cy};
		client.socket.emit('drawLine', {sid:client.sessionId,
										to:{x:cx, y:cy}});

		return false;
	};

	// color setting
	client.setColor = function(_color) {
		client.client_db[0].color = _color;
		client.socket.emit("setColor", {sid:client.sessionId, color:_color});
	};
	client.setColorBlack = function() {
		client.setColor('black');
	};
	client.setColorRed = function() {
		client.setColor('red');
	};
	client.setColorBlue = function() {
		client.setColor('blue');
	};
	client.setColorYellow = function() {
		client.setColor('yellow');
	};

	// line width setting
	client.setLineWidth = function(_lineWidth) {
		client.client_db[0].lineWidth = _lineWidth;
		client.socket.emit("setLineWidth", {sid:client.sessionId, lineWidth:_lineWidth});
	};
	client.setLineWidth1px = function() {
		client.setLineWidth(1);
	};
	client.setLineWidth3px = function() {
		client.setLineWidth(3);
	};
	client.setLineWidth5px = function() {
		client.setLineWidth(5);
	};

	$(window).load(function() {
		// show message
		client.showmsg('initializing');

		var $cvdiv = $('#cvdiv1');
		client.cvpos = {x:0, y:0};
		client.cvpos.x = $cvdiv.offset().left;
		client.cvpos.y = $cvdiv.offset().top;

		// get canvas's DOM element and context
		client.canvas = document.getElementById('cv1');
		if ( ! client.canvas || ! client.canvas.getContext ) { return false; }
		var ctx = client.canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.7;
		ctx.globalCompositeOperation = "source-over";

		// create canvas manager
		client.canvMng = new canvasManager.canv(ctx, client.canvas.width,
												client.canvas.height, client);
		client.canvMng.draw({x:0, y:0});

		// bind button event
		$('#stbtn1').mousedown(client.start);
		$('#savebtn').mousedown(client.saveImage);
		$('#restorebtn').mousedown(client.restoreImage);
		$('#clearbtn').mousedown(client.clearImage);
		$('#dispimgbtn').mousedown(client.displayImage);
		$('#dlimgbtn').mousedown(client.downloadImage);
		$('#color-black').bind('touchstart', client.setColorBlack);
		$('#color-black').bind('mousedown', client.setColorBlack);
		$('#color-red').bind('touchstart', client.setColorRed);
		$('#color-red').bind('mousedown', client.setColorRed);
		$('#color-blue').bind('touchstart', client.setColorBlue);
		$('#color-blue').bind('mousedown', client.setColorBlue);
		$('#color-yellow').bind('touchstart', client.setColorYellow);
		$('#color-yellow').bind('mousedown', client.setColorYellow);
		$('#line-1px').bind('touchstart', client.setLineWidth1px);
		$('#line-1px').bind('mousedown', client.setLineWidth1px);
		$('#line-3px').bind('touchstart', client.setLineWidth3px);
		$('#line-3px').bind('mousedown', client.setLineWidth3px);
		$('#line-5px').bind('touchstart', client.setLineWidth5px);
		$('#line-5px').bind('mousedown', client.setLineWidth5px);

		// bind socket.io event
		client.socket.on("connect", function(){
			console.log('connected');
		});
		client.socket.on('setPos', function (data) {
			// draw line by another client
			client.client_db[data.sid].prevPos = data.to;
		});
		client.socket.on('setColor', function (data) {
			// draw line by another client
			client.client_db[data.sid].color = data.color;
		});
		client.socket.on('setLineWidth', function (data) {
			// draw line by another client
			client.client_db[data.sid].lineWidth = data.lineWidth;
		});
		client.socket.on('drawLine', function (data) {
			// draw line by another client
			var conf = client.client_db[data.sid];
			client.canvMng.setPos({x:conf.prevPos.x, y:conf.prevPos.y});
			client.canvMng.setColor(conf.color);
			client.canvMng.setLineWidth(conf.lineWidth);
			client.canvMng.draw({x:data.to.x, y:data.to.y});
			conf.prevPos = data.to
		});
		client.socket.on('your sid', function (sid) {
			// get my session id from server
			console.log("session id: %d", sid);
			client.sessionId = sid;
			client.client_db[0] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
		});
		client.socket.on('client connected', function (sid) {
			// new client connected
			client.client_db[sid] = {color:'black', lineWidth:1, prevPos:{x:0, y:0}};
		});
		client.socket.on('client disconnected', function (data) {
		});
		client.socket.on('restore image', function(data) {
			client.canvMng.restoreImage(data);
		});
		client.socket.on('clear image', function(data) {
			client.canvMng.blank();
		});

		// show message
		client.showmsg('press start button');
	});
})(jQuery);
