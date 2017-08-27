var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.img = this.ctx.getImageData(0, 0, this.width, this.height)
	this.dew = new Dew(this.ctx, this.img);

	this.alphaGfx = document.createElement("canvas");
	this.dropletSize = 24;
	document.getElementById('contents').appendChild(this.alphaGfx);
	this.alphaGfx.height = this.dropletSize*2;
	this.alphaGfx.width = this.dropletSize*2;
	var alphaCtx = this.alphaGfx.getContext('2d');
	var grad = alphaCtx.createRadialGradient(this.dropletSize, this.dropletSize, 0, this.dropletSize, this.dropletSize, this.dropletSize);
	grad.addColorStop(0,  'rgba(0,0,0,.8');
	grad.addColorStop(.3, 'rgba(0,0,0,.6');
	grad.addColorStop(.7, 'rgba(0,0,0,0.3)');
	grad.addColorStop(.9, 'rgba(0,0,0,0.2)');
	grad.addColorStop(1,  'rgba(0,0,0,0)');
	alphaCtx.fillStyle = grad;
	alphaCtx.beginPath();
	alphaCtx.arc(this.dropletSize, this.dropletSize, this.dropletSize, 0, Math.PI*2, true);
	alphaCtx.fill();
	this.alphaThreshold = 224;

	var dropColor = $('#drop-color')[0];
	alphaCtx.globalCompositeOperation="source-in";
	alphaCtx.drawImage(dropColor, 0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaImage = alphaCtx.getImageData(0, 0, this.dropletSize*2, this.dropletSize*2);
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();
	this.dew.step();

	{// zantei
		//this.ctx.fillStyle = "rgb(128, 128, 224)";
		this.ctx.globalAlpha=1;
		this.ctx.globalCompositeOperation = 'source-over';
		var p = this.dew.particles;
		for (var i = 0; i < p.length; i++) {
			//this.ctx.fillRect(p[i].x, p[i].y, 4, 4);
			this.ctx.drawImage(this.alphaGfx, p[i].x - this.dropletSize/2, p[i].y - this.dropletSize/2);
		}
	}

	// filter by alpha threshold, shold be processed by pixel shader
	d = this.ctx.getImageData(0, 0, this.width, this.height);
	for (var i = 0; i < d.data.length; i += 4) {
		if (d.data[i + 3] < this.alphaThreshold) {
			d.data[i + 3] = 0;
		}
	}
	this.ctx.putImageData(d, 0, 0);

	//this.ctx.putImageData(this.alphaImage, 100, 100);

	requestAnimationFrame(this.draw.bind(this));
};

$(function() {
	apl = new Apl();
	apl.draw();
});
