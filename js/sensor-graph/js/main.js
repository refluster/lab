Apl = function() {
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
};

Apl.prototype.startSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	var sampleInterval = (parseInt($("#sampling-interval").val()) || 200);
	this.timer = setInterval(this.logDataPush.bind(this), sampleInterval);
	$('#save').text('stop');
	$('#save').off('click');
	$('#save').on('click', this.stopSaving.bind(this));
	$('#status').text('sampling');
};

Apl.prototype.stopSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).off('devicemotion');
	}
	clearInterval(this.timer);
	$('#save').text('start');
	$('#save').addClass('disabled');
	$('#status').text('uploading data');
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

	this.log.push([
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
		this.ePointers.deviceorientation.absolute,
		this.ePointers.deviceorientation.alpha,
		this.ePointers.deviceorientation.beta,
		this.ePointers.deviceorientation.gamma,
		this.ePointers.devicelight.value,
		this.ePointers.deviceproximity.max,
		this.ePointers.deviceproximity.min,
		this.ePointers.deviceproximity.value,
	]);
};

$(function() {
	var apl = new Apl();
});
