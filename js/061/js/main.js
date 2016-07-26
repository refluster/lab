Apl = function() {
	this.saving = false;

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
		$('#save').text('stop');
		this.saving = true;
	} else {
		$(window).unbind('devicemotion');
		$('#save').text('start');
		this.saving = false;
		this.logUpload();
	}
};

Apl.prototype.logUpload = function(evt) {
	var data = "test,test,test\n000,111,222";

	$.post('upload.cgi', {data: data}, function() {
		console.log('success');
	})
		.done(function(d) {
			console.log('done');
			console.log(d);
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
