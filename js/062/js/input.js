var Input = function(T) {
	this.T = T
	this.pressed = false;

	$('#canvas-main').on('touchstart', function(e) {
		this.pressed = true;
		var p = getCursor(e);
		this.x = this.x0 = p.x;
		this.y = this.y0 = p.y;
		this.vx = 0;
		this.vy = 0;
		e.preventDefault();
	}.bind(this));

	$('#canvas-main').on('touchmove', function(e) {
		var p = getCursor(e);
		this.x0 = p.x;
		this.y0 = p.y;
		e.preventDefault();
	}.bind(this));

	$('#canvas-main').on('touchend', function(e) {
		this.pressed = false;
	}.bind(this));
};
Input.prototype.step = function() {
	this.vx += (2 * ((this.x0 - this.x) / this.T - this.vx)) / this.T;
	this.vy += (2 * ((this.y0 - this.y) / this.T - this.vy)) / this.T;
	this.x += this.vx;
	this.y += this.vy;
};

function getCursor(e) {
	x = e.touches[0].pageX - e.target.offsetLeft;
	y = e.touches[0].pageY - e.target.offsetTop;
	return {x: x, y: y};
}
