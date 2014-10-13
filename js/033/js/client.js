$(function () {
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
		content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
								+ 'support WebSockets.'} ));
		return;
	}

	var connection = new WebSocket('ws://183.181.8.119:1338');
	var acg = {x: 0.0, y: 0.0, z: 0.0};
	var intervalId;
	var running = false;

	connection.onopen = function () {
		console.log("open");
		connection.send(JSON.stringify({op: "init", type: "sensor"}));
	};

	connection.onerror = function (error) {
		console.log("error");
		// an error occurred when sending/receiving data
	};

	connection.onmessage = function (message) {
		console.log("message");
		// try to decode json (I assume that each message from server is json)
		try {
			var json = JSON.parse(message.data);
		} catch (e) {
			console.log('This doesn\'t look like a valid JSON: ', message.data);
			return;
		}
	};

    window.addEventListener('devicemotion', function(evt) {
        acg = evt.accelerationIncludingGravity;
	});
	
	function sendMsg() {
		connection.send(JSON.stringify(
			{op: "sensor", data: {x: acg.x*4, y: 0, z: acg.y*4}}));
	}

	$('#connect').click(function() {
		if (!running) {
			$('#connect').html('disconnect server');
			intervalId = setInterval(sendMsg, 100);
			running = true;
		} else {
			$('#connect').html('connect server');
			clearInterval(intervalId);
			running = false;
		}
	});
});
