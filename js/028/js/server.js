var http = require('http');
var io = require('socket.io');
 
var fs = require('fs');

var server = http.createServer();
server.listen(8028);
var socket = io.listen(server);
 
var client_db = new Array();

socket.on('connection', function(client){
    // setup client db of the new commer
    console.log('=============== connected');

    client.emit('your sid', client.id);
    for (var i in client_db) {
        client.emit('client connected', i);
    }
    
    // notify all clients about the new client with session id
    client.broadcast.emit('client connected', client.id);

    // add client info into db
    client_db[client.id] = {color:'black', lineWidth:3, lastPos:{x:0, y:0}};
    
    // receive to set stearing info
    client.on('setStear', function(data) {
        client_db[data.sid].color = data.color;
        client.broadcast.emit('setStear', data);
    });
    
    // receive to set speed info
    client.on('setSpeed', function(data) {
        client.broadcast.emit('setSpeed', data);
    });
    
    client.on('disconnect', function() {
        client.emit('client disconnected', client.id);
        client.broadcast.emit('client disconnected', client.id);
    });
});
