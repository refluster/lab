var Apl = function() {
	this.initParams();
	this.initGraphicalElement();
	this.initConfig();
	this.dew = new Dew(this.ctx, this.width, this.height, {N: this.amount});
	this.animation = true;
	this.gravity = {x: 0.0, y: 0.0, z: 0.0};
};
Apl.prototype.initParams = function() {
	this.blurSize = 2;
	this.gravity = false;
	this.color = {r: 0, g: 0, b: 0};
};
Apl.prototype.initGraphicalElement = function() {
	var canvas = $('#canvas-watermap')[0];
	this.canvas = canvas;
	if ( ! canvas || ! canvas.getContext ) { return false; }
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");

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
	var dropBuffer = $('#drop-buffer')[0];
	dropBuffer.width = 24;
	dropBuffer.height = 24;
	var dropBufferCtx = dropBuffer.getContext('2d');
	dropBufferCtx.globalCompositeOperation = "source-over";
	dropBufferCtx.drawImage(dropColor,0,0,this.dropletSize,this.dropletSize);
	dropBufferCtx.globalCompositeOperation = "screen";
	dropBufferCtx.fillStyle = "rgba(0,0,24,1)";
	dropBufferCtx.fillRect(0,0,this.dropletSize,this.dropletSize);

	// drop buffer
	alphaCtx.globalCompositeOperation="source-in";
	alphaCtx.drawImage(dropBuffer, 0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaImage = alphaCtx.getImageData(0, 0, this.dropletSize*2, this.dropletSize*2);
	this.alphaThreshold = 224;

	// make blur texture
	{
		let fgBlur = $('#texture-fg-blur')[0];
		let fgCtx = fgBlur.getContext("2d");
		fgCtx.filter = 'blur(' + this.blurSize + 'px)';
		fgCtx.drawImage($('#texture-fg')[0], 0, 0, 300, 400);
		let bgBlur = $('#texture-bg-blur')[0]
		let bgCtx = bgBlur.getContext("2d");
		bgCtx.filter = 'blur(' + this.blurSize + 'px)';
		bgCtx.drawImage($('#texture-bg')[0], 0, 0, 300, 400);
	}
};
Apl.prototype.initConfig = function() {
	// animation on/off switch
	$('#switch-animation').click(function(e) {
		this.animation = !this.animation;
		if (this.animation == true) {
			this.draw();
		}
	}.bind(this));

	// debug image display on/off switch
	$('#switch-debug').click(function(e) {
		var display = $('#debug').css('display');
		display = (display == 'none'? 'block': 'none');
		$('#debug').css('display', display);
	}.bind(this));

	// set preset
	$('input[name=preset]').click(function() {
		switch($('input[name=preset]:checked').val()) {
		case 'leaf':
			$('input[name=blur]').val(0.0).change();
			$('input[name=color]').val(18).trigger('input').change();
			var bgSrc = 'img/texture-leaf.png';
			var fgSrc = 'img/texture-leaf.png';
			break;
		case 'centralpark':
			$('input[name=blur]').val(2.0).change();
			$('input[name=color]').val(0).trigger('input').change();
			var bgSrc = 'img/texture-centralpark.png';
			var fgSrc = 'img/texture-centralpark.png';
			break;
		case 'plain':
			$('input[name=blur]').val(0.0).change();
			$('input[name=color]').val(72).trigger('input').change();
			var bgSrc = 'img/texture-plain-fg.png';
			var fgSrc = 'img/texture-plain-fg.png';
			break;
		}
		let fg = $('#texture-fg')[0];
		let bg = $('#texture-bg')[0];
		fg.onload = function() {
			bg.onload = function() {
				apl.initGraphicalElement();
				apl.initWebgl();
			}
			bg.src = bgSrc;
		}
		fg.src = fgSrc;
	});

	const _this = this;

	// gravity / gravity degree
	$('input[name=gravity-degree]').bind('change', function(e) {
		var g = parseInt($(this).val());
		_this.gravityDegree = g;
		$('#gravity-degree-value').text(g + 'G');
		if (g !== 0) {
			console.log('on');
			$(window).on('devicemotion', getGravity.bind(_this));
		} else {
			console.log('off');
			$(window).off('devicemotion', getGravity.bind(_this));
			this.gravity.x = 0.0;
			this.gravity.y = 0.0;
			this.gravity.z = 0.0;
		}
	});
	$('input[name=gravity-degree]').change();

	// set blur size
	$('input[name=blur]').change(function(e) {
		var v = $(this).val();
		$('#blur-value').html(v + 'px');
		_this.blurSize = parseFloat(v);
		_this.initGraphicalElement();
		_this.initWebgl();
	});
	$('input[name=blur]').change();

	// set the amount
	$('input[name=amount]').change(function(e) {
		var v = $(this).val();
		$('#amount-value').html(v);
		_this.amount = parseFloat(v);
		delete this.dew;
		_this.dew = new Dew(_this.ctx, _this.width, _this.height, {N: _this.amount});
	});
	$('input[name=amount]').change();

	const color_div = parseInt($('input[name=color]').prop('max')) + 1;
	$('input[name=color]').on('input', function () {
		const h = $(this).val()*360/color_div;
		const hi = parseInt(h/60);
		const v = 255;
		const f = h/60 - hi;
		const m = 0;
		const n = parseInt(255*(1 - f));
		const k = parseInt(255*f);
		var r, g, b;
		switch(hi) {
		case 0: r = v, g = k, b = m; break;
		case 1: r = n, g = v, b = m; break;
		case 2: r = m, g = v, b = k; break;
		case 3: r = m, g = n, b = v; break;
		case 4: r = k, g = m, b = v; break;
		case 5: r = v, g = m, b = n; break;
		}

		$('#color-sample').css('background-color', 'rgb('+ r + ',' + g + ',' + b + ')');
		_this.color.r = r;
		_this.color.g = g;
		_this.color.b = b;
	});
	$('input[name=color]').change(function(e) {
		_this.initWebgl();
	});
};
function getGravity(e) {
	this.gravity.x = e.originalEvent.accelerationIncludingGravity.x;
	this.gravity.y = e.originalEvent.accelerationIncludingGravity.y;
	this.gravity.z = e.originalEvent.accelerationIncludingGravity.z;
}

Apl.prototype.initWebgl = function() {
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

	// update shine color
	$('#drop-shine-color').width($('#drop-shine').width());
	$('#drop-shine-color').height($('#drop-shine').height());
	$('#drop-shine-color').attr('width', $('#drop-shine').width());
	$('#drop-shine-color').attr('height', $('#drop-shine').height());
	this.updateShineColor();

	// create uniform texture
	createTexture(gl, $('#canvas-watermap')[0], 0);
	createUniform(gl, this.shaderProgram, '1i', 'textureWatermap', 0);
	createTexture(gl, $('#texture-fg-blur')[0], 1);
	createUniform(gl, this.shaderProgram, '1i', 'textureFg', 1);
	createTexture(gl, $('#texture-bg-blur')[0], 2);
	createUniform(gl, this.shaderProgram, '1i', 'textureBg', 2);
	createTexture(gl, $('#drop-shine-color')[0], 3);
	createUniform(gl, this.shaderProgram, '1i', 'textureShine', 3);
};
Apl.prototype.blank = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Apl.prototype.draw = function() {
	this.blank();

	const c = this.gravityDegree/8192;
	this.dew.step({gravity: {x:this.gravity.x*c, y:this.gravity.y*c, z:this.gravity.z*c}});

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
Apl.prototype.updateShineColor = function() {
	const img = $('#drop-shine')[0];
	const canvas = $('#drop-shine-color')[0];
	const ctx = canvas.getContext("2d");
	const rate = 0.08;
	const rr = 1 - (255 - this.color.r)/255*rate;
	const rg = 1 - (255 - this.color.g)/255*rate;
	const rb = 1 - (255 - this.color.b)/255*rate;

	ctx.drawImage(img, 0, 0);
	var d = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < d.data.length; i += 4) {
		d.data[i + 0] = parseInt(d.data[i + 0] * rr);
		d.data[i + 1] = parseInt(d.data[i + 1] * rg);
		d.data[i + 2] = parseInt(d.data[i + 2] * rb);
	}
	ctx.putImageData(d, 0, 0);
};

$(function() {
	setTimeout(function() {
		apl = new Apl();
		apl.draw();
	}, 200); //zantei wait
});
