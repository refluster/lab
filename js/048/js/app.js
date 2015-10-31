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

	console.log('adduser:' + id);
};

Map.prototype.update = function(users) {
	var existUsers = {};

	for (var id in this.users) {
		existUsers[id] = false;
	}

	for (var id in users) {
		var u = users[id];

		if (this.users[id] == undefined) {
			this.addUser(id);
		}
		this.users[id].pos = u.pos;
		this.users[id].marker.setPosition( new google.maps.LatLng(u.pos.lat, u.pos.lng));
		this.users[id].info.setContent(u.name);
		this.users[id].info.open(this.map, this.users[id].marker);
		existUsers[id] = true;
	}

	// delete unexist users
	for (var id in existUsers) {
		if (existUsers[id] == false) {
			// delete user data
			console.log('delete ' + id);
			this.users[id].marker.setMap(null);
			delete this.users[id];
		}
	}
};

//////////////////////////////

var Comm = function() {
	this.socket = new io.connect("http://183.181.8.119:8087");
	this.pos = {};
};

Comm.prototype.setHandler = function(callback) {
	this.socket.on('update', function(users) {
		console.log(users);
		callback(users);
	});

	setInterval(this.sendPos.bind(this), 1000);
};

Comm.prototype.setName = function(name) {
    this.socket.emit('set/name', name);
};

Comm.prototype.sendPos = function() {
	if (!navigator.geolocation){
		$('#msg').text("<p>Geolocation is not supported by your browser</p>");
		return;
	}

	function success(position) {
		this.pos.lat = position.coords.latitude;
		this.pos.lng = position.coords.longitude;

		this.socket.emit('set/pos', this.pos.lat, this.pos.lng);
		$('#msg').text('lat:' + this.pos.lat + ' lng:' + this.pos.lng);
		console.log(this.pos);
	};

	function error() {
		console.log('error');
	};

	navigator.geolocation.getCurrentPosition(success.bind(this), error);
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
