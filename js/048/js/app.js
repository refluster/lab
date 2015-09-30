var Map = function() {
	var posOsaka = {lat: 34.563, lng: 135.644};

	this.users = {}; // name -> {pos, marker}

	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: posOsaka
	});
};

Map.prototype.addUser = function(id) {
	var marker = new google.maps.Marker({
		position: {lat: 0, lng: 0},
		map: this.map,
	});

	var infowindow = new google.maps.InfoWindow({
		content: ''
	});

	infowindow.open(this.map, marker);

	marker.addListener('click', function() {
		infowindow.open(this.map, marker);
	});

	this.users[id] = {
		name: name,
		pos: undefined,
		marker: marker,
		info: infowindow
	};

	console.log('adduser');
};

Map.prototype.update = function(users) {
	for (var id in users) {
		var u = users[id];

		if (this.users[id] == undefined) {
			this.addUser(id);
		}
		this.users[id].pos = u.pos;
		this.users[id].marker.setPosition( new google.maps.LatLng(u.pos.lat, u.pos.lng));
		this.users[id].info.setContent(u.name);
		this.users[id].info.open(this.map, this.users[id].marker);
	}
};


//////////////////////////////

var Comm = function() {
    this.socket = new io.connect("http://183.181.8.119:8087");
};

Comm.prototype.setHandler = function(callback) {
	this.socket.on('update', function(userList) {
		console.log(userList);
		callback(userList);
	});
};

Comm.prototype.setName = function(name) {
    this.socket.emit('set/name', name);
	setInterval(this.setPos.bind(this));
};

Comm.prototype.setPos = function() {
    this.socket.emit('set/pos', 34.8, 135.244);
};

function initMap() {
	var map = new Map();
	var comm = new Comm();

	comm.setHandler(map.update.bind(map));

    $("#messageForm").submit(function(){
		comm.setName($("#name").val());
        return false;
    });	
}
