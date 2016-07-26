Apl = function() {
	this.saving = false;
	this.ePointers = {};
	this.sampleInterval = 200; // msec

	$('#save').click(function() {
		this.startStopSaving();
	}.bind(this));
};

Apl.prototype.startStopSaving = function(evt) {
	if (this.saving == false) {
		$(window).bind('devicemotion', function(_e) {
			var e = _e.originalEvent;
			e.accelerationIncludingGravity.x;
			$('#text').text(e.accelerationIncludingGravity.x);
		});
		this.logHeader();
		this.timer = setInterval(this.logDataPush.bind(this), this.sampleInterval);
		$('#save').text('stop');
		this.saving = true;
	} else {
		$(window).unbind('devicemotion');
		clearInterval(this.timer);
		$('#save').text('start');
		this.saving = false;
		this.logUpload();
	}
};

Apl.prototype.logHeader = function(evt) {
	this.log = [['test00', 'test01', 'test02']];
}

Apl.prototype.logDataPush = function(evt) {
	this.log.push([3, 3, 3]);
	console.log(this.log);
};

Apl.prototype.logUpload = function(evt) {
	var data = "test,test,test\n000,111,222";

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
