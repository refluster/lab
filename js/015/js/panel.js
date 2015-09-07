var panelApl = function() {
	// get canvas's DOM element and context
	var canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.ctx = canvas.getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";
	
	// display
	this.area = {w:canvas.width, h:canvas.height};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser

	// set the position of the canvas on the browser
	var $canvas = $('#canvas');
	this.cvpos.x = $canvas.offset().left;
	this.cvpos.y = $canvas.offset().top;

	this.color = 'white'
	this.lineWidth = 1;
	this.PI2 = Math.PI * 2; // 2*pi
	this.radius = 30; // raduis of balls

	this.leaf = [];

	for (var i = 0; i < 1000; i++) {
		var rand = Math.floor(Math.random()*1024*1024);
		var x = rand%(this.area.w - 1);
		var y = rand%this.area.h;
		var r = 6 + rand%7;

		this.leaf.push({
			pos:{x:x, y:y},
			radius:r
		});
	}
};

panelApl.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.area.w, this.area.h);
};

panelApl.prototype.draw = function() {
	var sin5 = []
	var cos5 = [];

	for (var i = 0; i < 5; i++) {
		sin5[i] = Math.sin(i*Math.PI/5);
		cos5[i] = Math.cos(i*Math.PI/5);
	}

	this.blank();
	this.ctx.save();
	this.ctx.strokeStyle = this.color;
	this.ctx.globalAlpha = 0.5;

	for (var i = 0; i < this.leaf.length; i++) {
		var l = this.leaf[i];
		this.ctx.beginPath();
		for (var j = 0; j < cos5.length; j++) {
			this.ctx.moveTo(l.pos.x + Math.floor(l.radius*cos5[j]),
							l.pos.y + Math.floor(l.radius*sin5[j]));
			this.ctx.lineTo(l.pos.x - Math.floor(l.radius*cos5[j]),
							l.pos.y - Math.floor(l.radius*sin5[j]));
		}
		this.ctx.stroke();
	}
	this.ctx.restore();
};

$(function() {
    var apl = new panelApl();
	apl.draw();
});
