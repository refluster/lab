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
    for (var i = 30; i < 60; i++) {
        for (var j = 50; j < 80; j++) {
            this.img.data[(i * this.img.width + j) * 4 + 0] = 255;
            this.img.data[(i * this.img.width + j) * 4 + 1] = 0;
            this.img.data[(i * this.img.width + j) * 4 + 2] = 0;
            this.img.data[(i * this.img.width + j) * 4 + 3] = 255;
        }
    }

	this.dew.step();
	this.ctx.putImageData(this.img, 0, 0);

	//requestAnimationFrame(this.draw.bind(this));
};

$(function() {
	apl = new Apl();
	apl.draw();
});
