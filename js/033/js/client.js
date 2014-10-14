$(function () {
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	if (!window.WebSocket) {
		$('#msg').html($('<p>', { text: 'Sorry, but your browser doesn\'t '
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
	
	var a_acg = [];
	
	window.addEventListener('devicemotion', function(evt) {
		acg = evt.accelerationIncludingGravity;
		a_acg.push(evt.accelerationIncludingGravity);
		if (a_acg.length > 3) {
			a_acg.shift();
		}
	});
	
	function sendMsg() {
		var max, min;

		max = a_acg[0].x, min = a_acg[0].x;
		for (var i = 1; i < a_acg.length; i++) {
			if (max < a_acg[i].x) {
				max = a_acg[i].x;
			}
			if (min > a_acg[i].x) {
				min = a_acg[i].x;
			}
		}
		acg.x = (max + min) / 2;

		max = a_acg[0].y, min = a_acg[0].y;
		for (var i = 1; i < a_acg.length; i++) {
			if (max < a_acg[i].y) {
				max = a_acg[i].y;
			}
			if (min > a_acg[i].y) {
				min = a_acg[i].y;
			}
		}
		acg.y = (max + min) / 2;

		max = a_acg[0].z, min = a_acg[0].z;
		for (var i = 1; i < a_acg.length; i++) {
			if (max < a_acg[i].z) {
				max = a_acg[i].z;
			}
			if (min > a_acg[i].z) {
				min = a_acg[i].z;
			}
		}
		acg.z = (max + min) / 2;
		
		connection.send(JSON.stringify(
			{op: "sensor", data: {x: acg.x*4, y: 0, z: acg.y*4}}));
	}
	
	$('#connect').click(function() {
		if (!running) {
			intervalId = setInterval(sendMsg, 100);
			running = true;
			$('#connect').html('disconnect server');
		} else {
			clearInterval(intervalId);
			running = false;
			$('#connect').html('connect server');
		}
	});
});
