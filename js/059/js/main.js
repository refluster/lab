var Apl = function() {
	// get canvas DOM element and context
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) {
		return false;
	}
	this.ctx = $canvas[0].getContext("2d");

	// resize canvas
	$canvas.attr('width', $canvas.width());
	$canvas.attr('height', $canvas.height());

	// get canvas info
	this.canvasWidth = $canvas.attr('width')
	this.canvasHeight = $canvas.attr('height')

	// context settnigs
	this.ctx.strokeStyle = "#888";
	this.ctx.lineWidth = 1;
	this.ctx.globalCompositeOperation = "source-over";

	const COLUMNS = 5;
	const ROWS = 12;

	this.maps = [];

	var xpoint = [];
	for (var x = 0; x < COLUMNS + 1; x++) {
		xpoint.push(parseInt(this.canvasWidth/COLUMNS*x));
	}

	var ypoint = [];
	for (var y = 0; y < ROWS + 1; y++) {
		ypoint.push(parseInt(this.canvasHeight/ROWS*y));
	}

	for (var y = 0; y < ROWS; y++) {
		for (var x = 0; x < COLUMNS; x++) {
			this.maps.push({x: xpoint[x],
							y: ypoint[y],
							w: xpoint[x + 1] - xpoint[x],
							h: ypoint[y + 1] - ypoint[y]
						   });
		}
	}

	this.ctx.fillStyle = 'yellow';
	this.color = true;
	this.posIdx = 0;
	this.animating = true;
	this.frame();
};

Apl.prototype.frame = function() {
	this.drawNext();
	if (this.animating) {
		requestAnimationFrame(this.frame.bind(this));
	}
};

Apl.prototype._blank = function() {
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Apl.prototype.draw = function() {
	var m = this.maps[this.posIdx];
	this.ctx.fillRect(m.x, m.y, m.w, m.h);
};

Apl.prototype.drawNext = function() {
	this.draw();
	if (this.posIdx + 1 >= this.maps.length) {
		this.posIdx = 0;
		//this.ctx.fillStyle = (this.ctx.fillStyle == 'yellow' ? 'black': 'yellow');
		this.ctx.fillStyle = (this.color ? 'black': 'yellow');
		this.color = !this.color;
	} else {
		this.posIdx ++;
	}
};

Apl.prototype.setInterval = function() {
	this.timer = setInterval(this.drawNext.bind(this), 20);
};

$(function() {
	var apl = new Apl();
});
