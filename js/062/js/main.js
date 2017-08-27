var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.img = this.ctx.getImageData(0, 0, this.width, this.height)
	this.dew = new Dew(this.ctx, this.img);
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();
	this.dew.step();

	{// zantei
		this.ctx.fillStyle = "rgb(128, 128, 224)";
		var p = this.dew.particles;
		for (var i = 0; i < p.length; i++) {
			this.ctx.fillRect(p[i].x, p[i].y, 4, 4);
		}
	}

	//////////////////////////////
	//var canvas = $('#canvas2')[0]; 
	var canvas = document.createElement("canvas");
	document.getElementById('contents').appendChild(canvas);
	canvas.id = "gamecanvas";
	canvas.height = 50;
	canvas.width = 50;

	var ctx = canvas.getContext('2d');
	var grad = ctx.createRadialGradient(25, 25, 0, 25, 25, 25);
	grad.addColorStop( 0, 'rgba(100,255,200,1');
	grad.addColorStop( 0.7, 'rgba(100,255,200,0.2)' );
	grad.addColorStop( 0.9, 'rgba(100,255,200,0.05)' );
	grad.addColorStop( 1, 'rgba(100,255,200,0)' );
	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.arc(25, 25, 25, 0, Math.PI*2, true);
	ctx.fill();

	var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	this.ctx.putImageData(image, 100, 100);

	//requestAnimationFrame(this.draw.bind(this));
};

$(function() {
	apl = new Apl();
	apl.draw();
});
