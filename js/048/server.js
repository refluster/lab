const defaultPosition = {lat: 34.6, lng: 135.644};

var http = require('http');
var io = require('socket.io')();

var server = http.createServer();
server.listen(8087);
var socket = io.listen(server);

var users = {};

setInterval(function() {
	var list = [];

	console.log(users);

	for (var id in users) {
		var u = users[id];
		list.push(u);
	}

	//	io.emit('update', list);
	io.emit('update', users);

	console.log('emit');
}, 1000);

socket.on('connection', function(client){
	users[client.id] = {name: '--', pos: defaultPosition};

    client.on('set/name', function(name) {
		users[client.id].name = name;
	});

    client.on('set/pos', function(lat, lng) {
		users[client.id].pos = {lat: lat, lng: lng};
    });

    client.on('disconnect', function() {
		console.log('disconn');
		delete users[client.id];
    });
});
