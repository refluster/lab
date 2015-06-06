
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

Space = function() {
	this.w = $("#page-space").width();
	this.h = $("#page-space").height();
	this.cx = this.w/2;
	this.cy = this.h/2;
	this.size = (this.w > this.h)? this.h: this.w;

	this.earth = new Star($("#earth"));
	this.brightstar = new Star($("#brightstar"));
	this.darkstar = new Star($("#darkstar"));

	this.testRot = 0;
};
Space.prototype.setSize = function() {
	$("#space").css("height", this.size + 'px');
	$("#space").css("width", this.size + 'px');
	$("#space").css("transform", "translate(" +
					((this.w - this.size)/2) + "px, " +
					((this.h - this.size)/2) + "px)");

	this.earth.setSize(this.size / 8);
	this.brightstar.setSize(this.size / 10);
	this.darkstar.setSize(this.size / 10);
};
Space.prototype.setPosition = function() {
	this.earth.setPosition(this.size*0.2, this.size*0.7);
	this.brightstar.setPosition(this.size*0.6, this.size*0.4);
	this.darkstar.setPosition(this.size*0.3, this.size*0.7);
};
Space.prototype.display = function() {
	this.setSize();
	this.setPosition();
};
Space.prototype.testRotate = function() {
	const ratio = 0.6;
	var x = this.size/2 + ratio*this.size/2*Math.sin(this.testRot);
	var y = this.size/2 - ratio*this.size/2*Math.cos(this.testRot);
	this.earth.setPosition(x, y);

	this.testRot += 0.1;
}

window.onload = function() {
	var space = new Space();

	space.display();
	setInterval(space.testRotate.bind(space), 100);
//	space.testRotate();
};

