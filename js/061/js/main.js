Apl = function() {
	this.ePointers = {};
	this.sampleInterval = 200; // msec

	$('#save').bind('click', this.startSaving.bind(this));
};

Apl.prototype.startSaving = function(evt) {
	$(window).bind('devicemotion', function(_e) {
		var e = _e.originalEvent;
		e.accelerationIncludingGravity.x;
		$('#text').text(e.accelerationIncludingGravity.x);
	});
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
	this.log.push([3, 3, 3]);
	console.log(this.log);
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
