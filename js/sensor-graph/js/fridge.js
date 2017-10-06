Apl = function() {
	this.ePointers = {
		devicemotion: {
			accelerationIncludingGravity: {x: '-', y: '-', z: '-'},
			acceleration: {x: '-', y: '-', z: '-'},
			rotationRate: {alpha: '-', beta: '-', gamma: '-'}},
	};

	$('#save').on('click', this.startSensing.bind(this));

	$('#status').text('ready');

	let graphLeftMsec = 2000;
	let graphRightMsec = 6000;

	this.sampleInterval = 200;
	this.tick = 0;
	this.drawGraph(1,
				   this.tick*this.sampleInterval - graphLeftMsec,
				   this.tick*this.sampleInterval + graphRightMsec);

	this.socket = io.connect('http://lab.schememono.net:8881');
	this.socket.on('log', function(d) {
		if (d.data[1] == '-') {
			return;
		}
		this.log.push(d.data);
		this.logDateFormat(this.log);
		this.drawGraph(1,
					   this.tick*this.sampleInterval - graphLeftMsec,
					   this.tick*this.sampleInterval + graphRightMsec);
		this.tick ++;
	}.bind(this));
	this.socket.on('logreset', function() {
		this.tick = 0;
		this.log = [];
	}.bind(this));
};

Apl.prototype.startSensing = function(e) {
	this.sampleInterval = 10;

	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	this.socket.emit('logreset');
	this.timer = setInterval(this.logDataPush.bind(this), this.sampleInterval);
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
		this.ePointers.devicemotion.rotationRate.gamma,
	];
	this.socket.emit('collect', {
		data: newRecord
	});
};

Apl.prototype.logDateFormat = function(data) {
	var parseTime = d3.timeParse('%Y/%m/%d %H:%M:%S.%L');	
	var beginDate = parseTime(data[0][0]);
	data.forEach(function(d) {
		d.date = parseTime(d[0]) - beginDate;
	});
};

var apl; // for debug
$(function() {
	apl = new Apl();
});
