Apl = function() {
	this.sampleInterval = 200; // msec

	this.ePointers = {
		devicemotion: {
			accelerationIncludingGravity: {x: '-', y: '-', z: '-'},
			acceleration: {x: '-', y: '-', z: '-'},
			rotationRate: {alpha: '-', beta: '-', gamma: '-'}},
		deviceorientation: {absolute: '-', alpha: '-', beta: '-', gamma: '-'},
		devicelight: {value: '-'},
		deviceproximity: {max: '-', min: '-', value: '-'},
	};

	$('#save').bind('click', this.startSaving.bind(this));

	var d = $('#sense tbody');
	d.append('<tr><td>acceleration including gravity</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>acceleration</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>rotation rate</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>gyroscope</td>' +
			 '<td>' + (window.DeviceOrientationEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>ambient light</td>' +
			 '<td>' + (window.DeviceLightEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>proximity</td>' +
			 '<td>' + (window.DeviceProximityEvent? 'ok': '-') + '</td></tr>');
};

Apl.prototype.startSaving = function(evt) {
	$(window).on('devicemotion', function(e) {
		$('#text').text(e.originalEvent.accelerationIncludingGravity.x);
		this.ePointers.devicemotion = e.originalEvent;
	}.bind(this));
	$(window).on('deviceorientation', function(e) {
		this.ePointers.deviceorientation = e.originalEvent;
	}.bind(this));
	$(window).on('devicelight', function(e) {
		this.ePointers.devicelight = e.originalEvent;
	}.bind(this));
	$(window).on('deviceproximity', function(e) {
		this.ePointers.deviceproximity = e.originalEvent;
	}.bind(this));
	this.logHeader();
	this.timer = setInterval(this.logDataPush.bind(this), this.sampleInterval);
	console.log(this.timer);
	$('#save').text('stop');
	$('#save').off('click');
	$('#save').on('click', this.stopSaving.bind(this));
};

Apl.prototype.stopSaving = function(evt) {
	$(window).unbind('devicemotion');
	console.log(this.timer);
	clearInterval(this.timer);
	this.logUpload();
	$('#save').text('start');
	$('#save').off('click');
	$('#save').on('click', this.startSaving.bind(this));
};

Apl.prototype.logHeader = function(evt) {
	this.log = [['test00', 'test01', 'test02']];
}

Apl.prototype.logDataPush = function(evt) {
	this.log.push([
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

Apl.prototype.logUpload = function(evt) {
	var data = $.map(this.log, function(n, i) {return n.join(',')}).join("\n");

	$.post('upload.cgi', {data: data}, function() {
		console.log('success');
	})
		.done(function(d) {
			console.log('done');
		})
		.fail(function() {
			console.log('fail');
		})
		.always(function() {
			console.log('always');
		});
};

$(function() {
	var apl = new Apl();
});
