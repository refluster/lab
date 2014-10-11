$(function () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
	content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
				+ 'support WebSockets.'} ));
	input.hide();
	$('span').hide();
	return;
    }

    var connection = new WebSocket('ws://183.181.8.119:1338');

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
        // handle incoming message
    };

    var input = $('#input');
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            connection.send(JSON.stringify({op: "sensor", data: {x: 123, y:345}}));
            $(this).val('');
        }
    });
});
