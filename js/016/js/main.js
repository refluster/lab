var sin5 = []
var cos5 = [];

for (var i = 0; i < 5; i++) {
	sin5[i] = Math.sin(i*Math.PI/5);
	cos5[i] = Math.cos(i*Math.PI/5);
}

var Apl = function() {
	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";

	// display
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	this.color = 'white';
	this.leaf = [];

	$canvas.attr('width', this.canvasWidth);
	$canvas.attr('height', this.canvasHeight);

	// set event
	var $btn = $('#btn1'); // start button
	$btn.mousedown(this.update.bind(this));
	$btn.text("update");

	setTimeout(this.update.bind(this), 1000);
};

Apl.prototype.blank = function() {
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Apl.prototype.init = function() {
	this.blank();
	this.clearLeaf();
};

Apl.prototype.clearLeaf = function() {
	this.leaf = [];
};

Apl.prototype.addLeaf = function(number, rmin, rmax) {
	for (var i = 0; i < number; i++) {
		var rand = Math.floor(Math.random()*1024*1024);
		var x = rand%(this.canvasWidth- 1);
		var y = rand%this.canvasHeight;
		var r = rmin + rand%(rmax - rmin);

		this.leaf.push({
			pos:{x:x, y:y},
			radius:r
		});
	}
};

Apl.prototype.draw = function() {
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

Apl.prototype.update = function() {
	var number = document.form1.input_number.value;
	var rmin = document.form1.input_rmin.value;
	var rmax = document.form1.input_rmax.value;
	var seconds = document.form1.input_seconds.value;;
	var fps = document.form1.input_fps.value;;

	// check if inputs are number
	if (isNaN(number) || isNaN(rmin) || isNaN(rmax) ||
		isNaN(seconds) || isNaN(fps)) {
		//this.showmsg("incorrect input");
		return;
	}

	number = Number(number);
	rmin = Number(rmin);
	rmax = Number(rmax);
	seconds = Number(seconds);
	fps = Number(fps);

	if (number < 0 || rmin < 0 || rmax < 0 || seconds < 0 || fps < 0) {
		//this.showmsg("values must be positive");
		return;
	}

	if (rmin > rmax) {
		//this.showmsg("rmax must be larger than rmin");
		return;
	}

	this.init();

	var curNumber = 0;
	var incNumber = number/(seconds*fps);

	var addAndDraw = function() {
		this.clearLeaf();
		if (curNumber + incNumber > number) {
			this.addLeaf(number - curNumber, rmin, rmax);
		} else {
			setTimeout(addAndDraw, 1000/fps);
			this.addLeaf(incNumber, rmin, rmax);
			curNumber += incNumber;
		}
		this.draw();
	}.bind(this);

	var timer = setTimeout(addAndDraw, 50);
};

$(function() {
	var apl = new Apl();
});
