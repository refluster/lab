var Apl = function() {
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();

	this.leaf = [];
	for (var i = 0; i < 1000; i++) {
		var rand = Math.floor(Math.random()*1024*1024);
		var x = rand%(this.canvasWidth - 1);
		var y = rand%this.canvasHeight;
		var r = 6 + rand%7;

		this.leaf.push({
			pos: {x: x, y: y},
			radius: r
		});
	}
};

Apl.prototype.draw = function() {
	var sin5 = [], cos5 = [];
	for (var i = 0; i < 5; i++) {
		sin5[i] = Math.sin(i*Math.PI/5);
		cos5[i] = Math.cos(i*Math.PI/5);
	}

	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

	this.ctx.strokeStyle = 'white';
	this.ctx.globalAlpha = 0.5;

	this.leaf.forEach(function(l) {
		this.ctx.beginPath();
		for (var i = 0; i < cos5.length; i++) {
			this.ctx.moveTo(l.pos.x + Math.floor(l.radius*cos5[i]),
							l.pos.y + Math.floor(l.radius*sin5[i]));
			this.ctx.lineTo(l.pos.x - Math.floor(l.radius*cos5[i]),
							l.pos.y - Math.floor(l.radius*sin5[i]));
		}
		this.ctx.stroke();
	}.bind(this));
};

$(function() {
    var apl = new Apl();
	apl.draw();
});
