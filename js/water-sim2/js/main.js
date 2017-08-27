var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.img = this.ctx.getImageData(0, 0, this.width, this.height)
	this.dew = new Dew(this.img);
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();
	this.dew.step();

	//this.ctx.putImageData(this.img, 0, 0); //zanei

	{// zantei
		this.ctx.fillStyle = "rgb(128, 128, 224)";
		var p = this.dew.particles;
		for (var i = 0; i < p.length; i++) {
			this.ctx.fillRect(p[i].x, p[i].y, 4, 4);
		}
	}

	requestAnimationFrame(this.draw.bind(this));
};

$(function() {
	apl = new Apl();
	apl.draw();
});
