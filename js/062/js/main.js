var Apl = function() {
	var canvas = $('#canvas-watermap')[0];
	this.canvas = canvas;
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");
	this.img = this.ctx.getImageData(0, 0, this.width, this.height)
	this.dew = new Dew(this.ctx, this.img);

	// create alpha gfx canvas
	this.alphaGfx = $('#alpha-gfx')[0];
	this.dropletSize = 24;
	this.alphaGfx.height = this.dropletSize*2;
	this.alphaGfx.width = this.dropletSize*2;
	var alphaCtx = this.alphaGfx.getContext('2d');

	// load and draw alpha image
	var dropAlpha = $('#drop-alpha')[0];
	alphaCtx.globalCompositeOperation="source-over";
	alphaCtx.drawImage(dropAlpha, 0, 0, this.dropletSize*2, this.dropletSize*2);

	// load and source in draw color channel image
	var dropColor = $('#drop-color')[0];

	// drop buffer
	var _c = $('#drop-buffer')[0];
	_c.width = 24;
	_c.height = 24;
	var _ctx = _c.getContext('2d');
	_ctx.globalCompositeOperation = "source-over";
	_ctx.drawImage(dropColor,0,0,this.dropletSize,this.dropletSize);
	_ctx.globalCompositeOperation = "screen";
	_ctx.fillStyle = "rgba(0,0,24,1)";
	_ctx.fillRect(0,0,this.dropletSize,this.dropletSize);

	// drop buffer
	alphaCtx.globalCompositeOperation="source-in";
	alphaCtx.drawImage(_c, 0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaImage = alphaCtx.getImageData(0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaThreshold = 224;

	// webgl setup
	var c = $('#canvas-main')[0];
	this.gl = c.getContext('webgl') || c.getContext('experimental-webgl');
	var gl = this.gl;
	this.shaderProgram = initShaderProgram(gl,
										   document.getElementById('vert-shader').text,
										   document.getElementById('frag-shader').text);
	// gl create rectangle
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-1.0, -1.0,
			1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			1.0,  1.0]),
		gl.STATIC_DRAW);

	// Tell WebGL to use our program when drawing
	gl.useProgram(this.shaderProgram);

	// gl vertex data
	var positionLocation = gl.getAttribLocation(this.shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	let resolutionLocation = gl.getUniformLocation(this.shaderProgram, "u_resolution");
	gl.uniform2f(resolutionLocation, 300, 400);

	createTexture(gl, $('#canvas-watermap')[0], 0);
	createUniform(gl, this.shaderProgram, '1i', 'textureWatermap', 0);
	createTexture(gl, $('#texture-fg')[0], 1);
	createUniform(gl, this.shaderProgram, '1i', 'textureFg', 1);
	createTexture(gl, $('#texture-bg')[0], 2);
	createUniform(gl, this.shaderProgram, '1i', 'textureBg', 2);
	createTexture(gl, $('#drop-shine')[0], 3);
	createUniform(gl, this.shaderProgram, '1i', 'textureShine', 3);

	$('#switch-animation').click(function(e) {
		this.animation = !this.animation;
		if (this.animation == true) {
			this.draw();
		}
	}.bind(this));

	$('#switch-debug').click(function(e) {
		var display = $('#debug').css('display');
		display = (display == 'none'? 'block': 'none');
		$('#debug').css('display', display);
	}.bind(this));

	this.animation = true;
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();
	this.dew.step();

	//this.drawParticles();
	this.drawSimpleColor();

	activeTexture(this.gl, 0);
	updateTexture(this.gl, this.canvas);
	drawScene(this.gl, this.shaderProgram, this.buffer);

	this.animation == true && requestAnimationFrame(this.draw.bind(this));
};
Apl.prototype.drawParticles = function() {
	this.ctx.globalCompositeOperation = 'source-over';
	this.ctx.fillStyle = "rgb(128, 128, 224)";
	var p = this.dew.particles;
	for (var i = 0; i < p.length; i++) {
		this.ctx.fillRect(p[i].x, p[i].y, 4, 4);
	}
};
Apl.prototype.drawSimpleColor = function() {
	this.ctx.globalAlpha=1;
	this.ctx.globalCompositeOperation = 'source-over';
	var p = this.dew.particles;
	for (var i = 0; i < p.length; i++) {
		this.ctx.drawImage(this.alphaGfx, p[i].x - this.dropletSize/2, p[i].y - this.dropletSize/2);
	}
}

$(function() {
	setTimeout(function() {
		apl = new Apl();
		apl.draw();
	}, 200); //zantei wait
});
