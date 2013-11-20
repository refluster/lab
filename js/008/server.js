var http = require('http');
var io = require('socket.io');
 
var server = http.createServer();
server.listen(8080);
var socket = io.listen(server);
 
var count = 0;
 
socket.on('connection', function(client){
    count++;
    client.emit('user connected', count);
    client.broadcast.emit('user connected', count);
    client.on('message', function(event){
        client.emit('message', {message: event.message, name: event.name});
        client.broadcast.emit('message', {message: event.message, name: event.name});
    });
    client.on('disconnect', function() {
        count--;
        client.emit('user disconnected', count);
        client.broadcast.emit('user disconnected', count);
    });
 
});

