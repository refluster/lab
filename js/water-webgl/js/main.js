var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.webgl = canvas.getContext("webgl");

};

$(function() {
	apl = new Apl();
});
