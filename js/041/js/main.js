
Star = function(elem) {
	this.elem = elem;
};
Star.prototype.setSize = function(size) {
	this.elem.css("height", size + "px");
	this.elem.css("width", size + "px");
	this.size = size;
};
Star.prototype.setPosition = function(x, y) {
	this.elem.css("transform", "translate(" + (x - this.size/2) + "px, " + (y - this.size/2) + "px)");
};

////////////////////////////////////////////////////////////
Space = function() {
	this.w = $("#page-space").width();
	this.h = $("#page-space").height();
	this.cx = this.w/2;
	this.cy = this.h/2;
	this.size = (this.w > this.h)? this.h: this.w;

	this.earthRadian = 0;

	this.earth = new Star($("#earth"));
	this.brightstar = new Star($("#brightstar"));
	this.darkstar = new Star($("#darkstar"));

	$(document).bind('touchstart', this.inputStart.bind(this));
	$(document).bind('touchmove', this.inputMove.bind(this));
	$(document).bind('touchend', this.inputEnd.bind(this));
};
Space.prototype.inputStart = function(e) {
	// from body coordinates
    var x = e.originalEvent.touches[0].pageX;
	var y = e.originalEvent.touches[0].pageY;
	this.earthRadian = Math.atan2(x - this.cx, y - this.cy);
	this.earthRotate();
};
Space.prototype.inputMove = function(e) {
    var x = e.originalEvent.touches[0].pageX;
	var y = e.originalEvent.touches[0].pageY;
	this.earthRadian = Math.atan2(x - this.cx, y - this.cy);
	this.earthRotate();
};
Space.prototype.inputEnd = function(e) {
};
Space.prototype.setSize = function() {
	$("#space").css("height", this.size + 'px');
	$("#space").css("width", this.size + 'px');
	$("#space").css("transform", "translate(" +
					((this.w - this.size)/2) + "px, " +
					((this.h - this.size)/2) + "px)");

	this.earth.setSize(this.size / 10);
	this.brightstar.setSize(this.size / 16);
	this.darkstar.setSize(this.size / 16);
};
Space.prototype.setPosition = function() {
	this.earth.setPosition(this.size*0.2, this.size*0.7);
	this.brightstar.setPosition(this.size/2, this.size/2 - this.size/2*0.7);
	this.darkstar.setPosition(this.size/2, this.size/2 + this.size/2*0.7);
};
Space.prototype.display = function() {
	this.setSize();
	this.setPosition();
};
Space.prototype.earthRotate = function() {
	const ratio = 0.6;
	var x = this.size/2 + ratio*this.size/2*Math.sin(this.earthRadian);
	var y = this.size/2 + ratio*this.size/2*Math.cos(this.earthRadian);
	this.earth.setPosition(x, y);
};

////////////////////////////////////////////////////////////
window.onload = function() {
	var space = new Space();

	space.display();
	setInterval(space.testRotate.bind(space), 100);
//	space.testRotate();
};

