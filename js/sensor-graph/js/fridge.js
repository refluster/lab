Apl = function() {
	$('#save').on('click', this.startSensing.bind(this));
	$('#status').text('ready');

	this.sampleInterval = 10;

	this.socket = io.connect('http://lab.schememono.net:8881');

	this.socket.on('fridge/angry', function() {
		console.log('fridge/angry');
	}.bind(this));

	this.socket.on('fridge/reset', function() {
		console.log('fridge/reset');
	}.bind(this));
};

Apl.prototype.startSensing = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.devicemotion = e.originalEvent;
		}.bind(this));
	}
	this.socket.emit('fridge/reset');
	this.timer = setInterval(this.sampleSensor.bind(this), this.sampleInterval);
	this.angry = false;
	$('#save').text('stop');
	$('#save').off('click');
	$('#save').on('click', this.stopSensing.bind(this));
	$('#status').text('sampling');
};

Apl.prototype.stopSensing = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).off('devicemotion');
	}
	clearInterval(this.timer);
	$('#save').text('start');
	$('#save').off('click');
	$('#save').on('click', this.startSensing.bind(this));
	$('#status').text('ready');
};

Apl.prototype.sampleSensor = function() {
	if (this.angry == false && this.devicemotion.rotationRate.beta >= 100) {
		this.angry = true;
		this.socket.emit('fridge/angry');
	}
};

var apl; // for debug
$(function() {
	apl = new Apl();
});
