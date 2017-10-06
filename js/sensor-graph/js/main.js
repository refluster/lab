Apl = function() {
	this.log = [];
	this.ePointers = {
		devicemotion: {
			accelerationIncludingGravity: {x: '-', y: '-', z: '-'},
			acceleration: {x: '-', y: '-', z: '-'},
			rotationRate: {alpha: '-', beta: '-', gamma: '-'}},
	};

	$('#save').on('click', this.startSaving.bind(this));

	var d = $('#sense tbody');
	d.append('<tr><td>acceleration including gravity</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>acceleration</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>rotation rate</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');

	$('#status').text('ready');

	this.socket = io.connect('http://lab.schememono.net:8881');
	this.socket.on('log', function(d) {
		console.log(d);
		this.log.push(d.data);
	}.bind(this));
	this.socket.on('logreset', function() {
		console.log('log reset');
		this.log = [];
	}.bind(this));
};

Apl.prototype.startSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	var sampleInterval = (parseInt($("#sampling-interval").val()) || 200);
	this.socket.emit('logreset');
	this.timer = setInterval(this.logDataPush.bind(this), sampleInterval);
	$('#save').text('stop');
	//$('#save').off('click');
	$('#save').on('click', this.stopSaving.bind(this));
	$('#status').text('sampling');
};

Apl.prototype.stopSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).off('devicemotion');
	}
	clearInterval(this.timer);
	$('#save').off('click');
	$('#save').on('click', this.startSaving.bind(this));
	$('#save').text('start');
};

Apl.prototype.logDataPush = function() {
	var date = new Date();
	var dateStr = date.getFullYear() + '/' +
		('0' + (date.getMonth() + 1)).slice(-2) + '/' +
		('0' + date.getDate()).slice(-2) + ' ' +
		('0' + date.getHours()).slice(-2)  + ':' +
		('0' + date.getMinutes()).slice(-2)  + ':' +
		('0' + date.getSeconds()).slice(-2)  + '.' +
		('0' + date.getMilliseconds()).slice(-3);
	var newRecord = [
		dateStr,
		this.ePointers.devicemotion.accelerationIncludingGravity.x,
		this.ePointers.devicemotion.accelerationIncludingGravity.y,
		this.ePointers.devicemotion.accelerationIncludingGravity.z,
		this.ePointers.devicemotion.acceleration.x,
		this.ePointers.devicemotion.acceleration.y,
		this.ePointers.devicemotion.acceleration.z,
		this.ePointers.devicemotion.rotationRate.alpha,
		this.ePointers.devicemotion.rotationRate.beta,
		this.ePointers.devicemotion.rotationRate.gamma];
	this.socket.emit('collect', {
		data: newRecord
	});
};

var apl; // for debug
$(function() {
	apl = new Apl();
});
