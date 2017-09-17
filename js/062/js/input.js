var Input = function(T) {
	this.T = T
	this.pressed = false;
	this.gravity = {x: 0.0, y: 0.0, z: 0.0};

	$('#canvas-main').on('touchstart mousedown', function(e) {
		this.pressed = true;
		var p = getCursor(e);
		this.x = this.x0 = p.x;
		this.y = this.y0 = p.y;
		this.vx = 0;
		this.vy = 0;
		e.preventDefault();
	}.bind(this));

	$('#canvas-main').on('touchmove mousemove', function(e) {
		if (this.pressed == true) {
			var p = getCursor(e);
			this.x0 = p.x;
			this.y0 = p.y;
		}
		e.preventDefault();
	}.bind(this));

	$('#canvas-main').on('touchend mouseup mouseleave', function(e) {
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
	if (e.touches) {
		x = e.touches[0].pageX - e.target.offsetLeft;
		y = e.touches[0].pageY - e.target.offsetTop;
	} else {
		x = e.offsetX;
		y = e.offsetY;
	}
	return {x: x, y: y};
}
