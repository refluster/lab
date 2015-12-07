var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var server = http.createServer();
server.listen(8028);
var socket = io.listen(server);
 
var display
var controller

socket.on('connection', function(client){
    // setup client db of the new commer
    console.log('=============== connected');

    client.emit('your sid', client.id);

    // notify all clients about the new client with session id
    client.broadcast.emit('client connected', client.id);

    client.on('set display', function(data) {
        display = client;
    });
    client.on('set controller', function(data) {
        controller = client;
    });
    
    // receive to set stearing info
    client.on('set stear', function(data) {
        display.emit('set stear', data);
        console.log('set stear');
    });
    
    // receive to set speed info
    client.on('set speed', function(data) {
        display.emit('set speed', data);
        console.log('set speed');
    });
    
    client.on('disconnect', function() {
        client.emit('client disconnected', client.id);
        client.broadcast.emit('client disconnected', client.id);
    });
});
