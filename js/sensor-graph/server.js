// Server side.
var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs');
app.listen(8881);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html', function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

io.sockets.on('connection', function(socket) {
console.log('conn');
	socket.on('collect', function(d) {
		socket.broadcast.emit('log', {
			data: d.data,
		});
		console.log('From client: ' + d.data);
	});
	socket.on('logreset', function(d) {
		socket.broadcast.emit('logreset');
		console.log('-- log reset');
	});
	socket.on('fridge/reset', function(d) {
		socket.broadcast.emit('fridge/reset');
		console.log('-- fridge/reset');
	});
	socket.on('fridge/angry', function(d) {
		socket.broadcast.emit('fridge/angry');
		console.log('-- fridge/angry');
	});
});

console.log('main');
