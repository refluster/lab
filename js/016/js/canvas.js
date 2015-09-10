var sin5 = []
var cos5 = [];

for (var i = 0; i < 5; i++) {
	sin5[i] = Math.sin(i*Math.PI/5);
	cos5[i] = Math.cos(i*Math.PI/5);
}

var canvasManager = function(ctx, w, h) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser

	var $cvdiv = $('#canvas');
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

	this.color = 'white'

	this.leaf = [];
};

canvasManager.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.area.w, this.area.h);
};

canvasManager.prototype.init = function() {
	this.blank();
	this.clearLeaf();
};

canvasManager.prototype.clearLeaf = function() {
	this.leaf = [];
};

canvasManager.prototype.addLeaf = function(number, rmin, rmax) {
	for (var i = 0; i < number; i++) {
		var rand = Math.floor(Math.random()*1024*1024);
		var x = rand%(this.area.w - 1);
		var y = rand%this.area.h;
		var r = rmin + rand%(rmax - rmin);

		this.leaf.push({
			pos:{x:x, y:y},
			radius:r
		});
	}
};

canvasManager.prototype.draw = function() {
	this.ctx.strokeStyle = this.color;
	this.ctx.globalAlpha = 0.5;

	this.leaf.forEach(function(l) {
		this.ctx.beginPath();
		for (var j = 0; j < cos5.length; j++) {
			this.ctx.moveTo(l.pos.x + Math.floor(l.radius*cos5[j]),
							l.pos.y + Math.floor(l.radius*sin5[j]));
			this.ctx.lineTo(l.pos.x - Math.floor(l.radius*cos5[j]),
							l.pos.y - Math.floor(l.radius*sin5[j]));
		}
		this.ctx.stroke();
	}.bind(this));
};
