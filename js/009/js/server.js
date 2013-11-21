var http = require('http');
var io = require('socket.io');
 
var fs = require('fs');
var savedImageFile = './saved.png';

var server = http.createServer();
server.listen(8081);
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
    
    // receive change color request {sid, color}
    client.on('setPos', function(data) {
        client_db[data.sid].prevPos = data.prevPos;
        client.broadcast.emit('setPos', data);
    });
    
    // receive change color request {sid, color}
    client.on('setColor', function(data) {
        client_db[data.sid].color = data.color;
        client.broadcast.emit('setColor', data);
    });
    
    // receive change line width request {sid, lineWidth}
    client.on('setLineWidth', function(data) {
        client_db[data.sid].lineWidth = data.lineWidth;
        client.broadcast.emit('setLineWidth', data);
    });
    
    // receive draw line {sid, to{x, y}}
    client.on('drawLine', function(data) {
        client.broadcast.emit('drawLine', data);
    });
    
    client.on('disconnect', function() {
        client.emit('client disconnected', client.id);
        client.broadcast.emit('client disconnected', client.id);
    });

    client.on('saveImage', function(data) {
        console.log('=========== save image ============')
        console.log(data.imgData);
        fs.writeFileSync(savedImageFile, data.imgData);
    });
    
    client.on('restoreImage', function(data) {
        console.log('===================== restore');
        var imgData = fs.readFileSync(savedImageFile, 'binary');
        client.emit('restore image', imgData);
        client.broadcast.emit('restore image', imgData);
    });
    
//////////////////////////////
    client.on('message', function(event){
        client.emit('message', {message: event.message, name: event.name});
        client.broadcast.emit('message', {message: event.message, name: event.name});
    });
});
