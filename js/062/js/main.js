function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function loadTexture(gl, image) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				  srcFormat, srcType, image);

	// WebGL1 has different requirements for power of 2 images
	// vs non power of 2 images so check if the image is a
	// power of 2 in both dimensions.
	if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		// Yes, it's a power of 2. Generate mips.
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		// No, it's not a power of 2. Turn of mips and set
		// wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}

	return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function drawScene(gl, programInfo, buffers, texture, deltaTime) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Tell WebGL which indices to use to index the vertices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);



	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

	{
		const vertexCount = 6;
		const first = 0;
		gl.drawArrays(gl.TRIANGLES, first, vertexCount);
	}
}

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
	this.alphaGfx = document.createElement("canvas");
	this.dropletSize = 24;
	document.getElementById('contents').appendChild(this.alphaGfx);
	this.alphaGfx.height = this.dropletSize*2;
	this.alphaGfx.width = this.dropletSize*2;
	var alphaCtx = this.alphaGfx.getContext('2d');

	// load and draw alpha image
	var dropAlpha = $('#drop-alpha')[0];
	alphaCtx.globalCompositeOperation="source-over";
	alphaCtx.drawImage(dropAlpha, 0, 0, this.dropletSize*2, this.dropletSize*2);

	// load and source in draw color channel image
	var dropColor = $('#drop-color')[0];
	alphaCtx.globalCompositeOperation="source-in";
	alphaCtx.drawImage(dropColor, 0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaImage = alphaCtx.getImageData(0, 0, this.dropletSize*2, this.dropletSize*2);

	this.alphaThreshold = 224;

	// webgl
	var c = $('#canvas-main')[0];
	this.gl = c.getContext('webgl') || c.getContext('experimental-webgl');
	console.log(this.gl);
	var gl = this.gl;
	const shaderProgram = initShaderProgram(gl,
											document.getElementById('vert-shader').text,
											document.getElementById('frag-shader').text);

	this.programInfo = {
		program: shaderProgram,
		//attribLocations: {
		//	vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		//	textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		//},
		uniformLocations: {
			//projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			//modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
	};

	//////////////////////////////
	// create rectangle
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

	// vertex data
	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();
	this.dew.step();

	//this.drawParticles();
	this.drawSimpleColor();
	//requestAnimationFrame(this.draw.bind(this));

	const texture = loadTexture(this.gl, this.canvas);
	drawScene(this.gl, this.programInfo, this.buffer, texture);
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
	// filter by alpha threshold, shold be processed by pixel shader
	d = this.ctx.getImageData(0, 0, this.width, this.height);
	for (var i = 0; i < d.data.length; i += 4) {
		if (d.data[i + 3] < this.alphaThreshold) {
			d.data[i + 3] = 0;
		}
	}
	this.ctx.putImageData(d, 0, 0);
}

$(function() {
	apl = new Apl();
	apl.draw();
});
