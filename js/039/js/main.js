$(function(){
	function movable(id) {
		this.state = {
			offset_x: 0,
			last_margin_x: 0,
		};

		this.obj = $(id);

		this.bodyObj = $('body');

		this.obj.mousedown(function(e) {
			this.state.offset_x = e.pageX - this.state.last_margin_x;

			this.bodyObj.mousemove(function(e) {
				this.state.last_margin_x = e.pageX - this.state.offset_x;
				this.obj.css({'marginLeft': this.state.last_margin_x + 'px'});
			}.bind(this));
			
			this.bodyObj.mouseup(function(e) {
				this.bodyObj.unbind('mousemove');
				this.bodyObj.unbind('mouseup');
			}.bind(this));
		}.bind(this));
		
	}

	var sun = new movable('#sun');
	var cloud = new movable('#cloud');

	$('img').on('dragstart', function(event) {
		event.preventDefault();
	});
});
