Apl = function() {
	$('#save').on('click', this.startSensing.bind(this));
	$('#status').text('ready');

	this.sampleInterval = 10;

	this.socket = io.connect('http://lab.schememono.net:8881');

	this.socket.on('fridge/angry', function() {
		console.log('fridge/angry')
		this.playCalmDown();
	}.bind(this));

	this.socket.on('fridge/reset', function() {
		console.log('fridge/reset');
		this.resetCalmDown();
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

Apl.prototype.playCalmDown = function() {
	console.log('play calm down');
	$('#panel .text').addClass('fadeIn');
	$('#calmdown')[0].play();
	setTimeout(() => {
		$('#panel .image').addClass('fadeIn');
		$('#jazz')[0].play();
	}, 3000);
};

Apl.prototype.resetCalmDown = function() {
	console.log('reset calm down');
	$('#panel .text').removeClass('fadeIn');
	$('#panel .image').removeClass('fadeIn');
	$('#calmdown')[0].pause();
	$('#calmdown')[0].currentTime = 0;
	$('#jazz')[0].pause();
	$('#jazz')[0].currentTime = 0;
};

var apl; // for debug
$(function() {
	apl = new Apl();
});
