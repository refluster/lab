var Input = function() {
	this.pressed = false;

	$('#canvas').on('touchstart', function(e) {
		this.pressed = true;
		var p = getCursor(e);
		e.preventDefault();
	}.bind(this));

	$('#canvas').on('touchmove mousemove', function(e) {
		var p = getCursor(e);
		e.preventDefault();
	}.bind(this));

	$('#canvas').on('touchend mouseup', function(e) {
		this.pressed = false;
	}.bind(this));
};
function getCursor(e) {
	x = e.touches[0].pageX - e.target.offsetLeft;
	y = e.touches[0].pageY - e.target.offsetTop;
	return {x: x, y: y};
}
