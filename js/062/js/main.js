var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.img = this.ctx.getImageData(0, 0, this.width, this.height)
	this.dew = new Dew(this.ctx, this.img);

	this.alphaGfx = document.createElement("canvas");
	var r = 16;
	this.dropletSize = r;
	document.getElementById('contents').appendChild(this.alphaGfx);
	this.alphaGfx.height = r*2;
	this.alphaGfx.width = r*2;
	var alphaCtx = this.alphaGfx.getContext('2d');
	var grad = alphaCtx.createRadialGradient(r, r, 0, r, r, r);
	grad.addColorStop(0,   'rgba(128,128,224,.5');
	grad.addColorStop(0.7, 'rgba(128,128,224,0.15)');
	grad.addColorStop(0.9, 'rgba(128,128,224,0.025)');
	grad.addColorStop(1,   'rgba(128,128,224,0)');
	alphaCtx.fillStyle = grad;
	alphaCtx.beginPath();
	alphaCtx.arc(r, r, r, 0, Math.PI*2, true);
	alphaCtx.fill();

    alphaCtx.globalCompositeOperation="source-in";
	alphaCtx.fillStyle = "rgb(96, 96, 224)";
	alphaCtx.fillRect(0, 0, r*2, r*2);
	this.alphaImage = alphaCtx.getImageData(0, 0, r*2, r*2);
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

	//this.ctx.putImageData(this.alphaImage, 100, 100);

	requestAnimationFrame(this.draw.bind(this));
};

$(function() {
	apl = new Apl();
	apl.draw();
});
