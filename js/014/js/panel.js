var panelApl = function() {
	this.dragging = false;
	this.timer = $.timer();

	// get canvas's DOM element and context
	var canvas = document.getElementById('cv1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = "source-over";
	
	// display
	this.canv = new canvasManager(ctx, canvas.width, canvas.height, this);
	this.canv.init();
	this.canv.draw();
	
	this.timer.set({
		action: function() {
			this.canv.moveObj();
			this.canv.draw();
			
			if (!this.canv.needToUpdate()) {
				this.timer.pause();
			}
		}.bind(this),
		time: 60
	});
	
	this.start();
};

panelApl.prototype.start = function() {
	var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
	// add mouse events to the canvas
	$cvdiv.mousedown(this.hDown.bind(this));
	$cvdiv.mouseup(this.hUp.bind(this));
	$cvdiv.mouseleave(this.hUp.bind(this));
	$cvdiv.mousemove(this.hMove.bind(this));
	// add touch events to the canvas
	$cvdiv.bind("touchstart", this.hDown.bind(this));
	$cvdiv.bind("touchend", this.hUp.bind(this));
	$cvdiv.bind("touchend", this.hUp.bind(this));
	$cvdiv.bind("touchmove", this.hMove.bind(this));
	
	// init canvas
	this.canv.init();

	// init timer
	this.timer.play();
};

panelApl.prototype.hDown = function(evt) {
	// convert coordinate from point to canvas
	var cx = evt.pageX - this.canv.cvpos.x;
	var cy = evt.pageY - this.canv.cvpos.y;
	this.dragging = true;
	return false;
};
panelApl.prototype.hUp = function(evt) {
	if (this.dragging == true) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		if (cx < 0) cx = 0;
		if (cx > this.canv.area.w) cx = this.canv.area.w;
		if (cy < 0) cy = 0;
		if (cy > this.canv.area.h) cy = this.canv.area.h;

		this.dragging = false;
	}
};
panelApl.prototype.hMove = function(evt) {
	if (this.dragging == true) {
		// convert coordinate from point to canvas
		var cx = evt.pageX - this.canv.cvpos.x;
		var cy = evt.pageY - this.canv.cvpos.y;
		// check if the canvas should be updated
		var updSep = 1; // #. of pixels that canvas is updated if an object is moved by
		// update the canvas
		this.canv.moveTo({x:cx, y:cy});
		this.timer.play();
	}
	return false;
};

$(function() {
    var apl = new panelApl();
});
