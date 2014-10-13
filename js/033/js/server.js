//https://www.npmjs.org/package/nodejs-websocket

var ws = require("nodejs-websocket")
var sensor;
var unity;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
    conn.on("text", function (str) {
		console.log("Received "+str)

		msg = JSON.parse(str);
		switch (msg.op) {
		case "init":
			if (msg.type == "unity") {
				unity = conn;
			} else if (msg.type == "sensor") {
				sensor = conn;
			}
			break;
		case "sensor":
            unity.sendText(JSON.stringify(msg.data));
			break;
		}
    })
	
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
}).listen(1338)
