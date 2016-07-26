Apl = function() {
	this.ePointers = {};
	this.sampleInterval = 200; // msec

	$('#save').bind('click', this.startSaving.bind(this));
};

Apl.prototype.startSaving = function(evt) {
	$(window).bind('devicemotion', function(e) {
		$('#text').text(e.originalEvent.accelerationIncludingGravity.x);
		this.ePointers.devicemotion = e.originalEvent;
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
