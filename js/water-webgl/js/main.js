var Apl = function() {
	var canvas = $('#canvas')[0];
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.gl = canvas.getContext("webgl");

	var vertexShader = createShader(this.gl, 'vert-shader', this.gl.VERTEX_SHADER);
	var fragShader = createShader(this.gl, 'frag-shader', this.gl.FRAGMENT_SHADER);

	var program = this.gl.createProgram();
	this.gl.attachShader(program, vertexShader);
	this.gl.attachShader(program, fragShader);

	this.gl.linkProgram(program);
	this.gl.useProgram(program);

	// create rectangle
	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
	this.gl.bufferData(
		this.gl.ARRAY_BUFFER,
		new Float32Array([
			-1.0, -1.0,
			1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			1.0,  1.0]),
		this.gl.STATIC_DRAW);

	// vertex data
	var positionLocation = this.gl.getAttribLocation(program, "a_position");
	this.gl.enableVertexAttribArray(positionLocation);
	this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};

function createShader(gl, source,type){
	var shader = gl.createShader(type);
	source = document.getElementById(source).text;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	return shader;
}

$(function() {
	apl = new Apl();
});
