/* HTML5 Canvas drag&drop */
var canvasManager = function(ctx, w, h) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
	this.grSep = 30;  // grid interval(px)

	// context settnigs
	this.ctx.strokeStyle = "#000";
	this.ctx.lineWidth = 1;
	this.ctx.globalAlpha = 0.7;
	this.ctx.globalCompositeOperation = "source-over";

	// initial position of items
	this.itemAr = []; // items
	this.itemAr[0] = {x: this.grSep/2, y: this.grSep/2, type: 'circle'};
	this.itemAr[1] = {x: this.grSep/2, y: this.grSep/2 + this.grSep, type: 'triangle'};
	this.itemAr[2] = {x: this.grSep/2, y: this.grSep/2 + this.grSep*2, type: 'square'};
}

/* init canvas
 * return: none
 */
canvasManager.prototype.blank = function() {
	// clear
	this.ctx.clearRect(0, 0, this.area.w, this.area.h);

	for (var x = 0; x < this.area.w; x += this.grSep) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.area.h);
		this.ctx.stroke();
	}

	for (var y = 0; y < this.area.h; y += this.grSep) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, y);
		this.ctx.lineTo(this.area.w, y);
		this.ctx.stroke();
	}
};

/* draw canvas
 * return: none
 */
canvasManager.prototype.draw = function() {
	// init canvas
	this.blank();
	// draw items
	for (var i = 0; i < this.itemAr.length; i++) {
		switch (this.itemAr[i].type) {
		case 'circle':
			this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
			break;
		case 'triangle':
			this.drawTri(this.itemAr[i].x, this.itemAr[i].y);
			break;
		case 'square':
			this.drawSqu(this.itemAr[i].x, this.itemAr[i].y);
			break;
		default:
			this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
			break;
		}
	}
};


/* draw circle with this.grSep - 2px diameter
 * {int} x: center x-pos
 * {int} y: center y-pos
 * return: none
 */
canvasManager.prototype.drawCir = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'green';
	this.ctx.beginPath();
	this.ctx.arc(x, y, this.grSep/2, 0, Math.PI*2, false);
	this.ctx.fill();
	this.ctx.restore();
};

/* draw trianle with this.grSep - 2px on a side
 * {int} x: center x-pos
 * {int} y: center y-pos
 * return: none
 */
canvasManager.prototype.drawTri = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'blue';
	this.ctx.beginPath();
	this.ctx.moveTo(x, y - this.grSep/2);
	this.ctx.lineTo(x - this.grSep/2, y + this.grSep/2);
	this.ctx.lineTo(x + this.grSep/2, y + this.grSep/2);
	this.ctx.closePath();
	this.ctx.fill();
	this.ctx.restore();
};

/* draw regular square with this.grSep - 2px on a side
 * {int} x: center x-pos
 * {int} y: center y-pos
 * return: none
 */
canvasManager.prototype.drawSqu = function(x, y) {
	this.ctx.save();
	this.ctx.fillStyle = 'purple';
	this.ctx.fillRect(x - this.grSep/2, y - this.grSep/2,
					  this.grSep, this.grSep);
	this.ctx.restore();
};

/* check if an item is on the specified position
 * {int} x: x-pos
 * {int} y: y-pos
 * return: index of this.itemAr or null
 */
canvasManager.prototype.checkItem = function(x, y) {
	for (var i = 0; i < this.itemAr.length; i++) {
		if (x >= this.itemAr[i].x - this.grSep/2 &&
			x <= this.itemAr[i].x + this.grSep/2 &&
			y >= this.itemAr[i].y - this.grSep/2 &&
			y <= this.itemAr[i].y + this.grSep/2) {
			return i;
		}
	}
	return null;
};
