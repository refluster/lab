var App = function() {
	this.canvas = document.getElementById('canvas');
	this.input = document.getElementById('input');
	this.canvas.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
	this.canvas.addEventListener("touchmove", this.touchMoveHandler.bind(this), false);
	this.canvas.addEventListener("touchend", this.touchEndHandler.bind(this), false);

	this.isDragging = false;

	this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
};

App.prototype.getCanvasPosition = function(e) {
	if (e.touches.length > 0) {
		var b = this.canvas.getClientRects()[0];
		return {x: parseInt(e.touches[0].clientX - b.left),
				y: parseInt(e.touches[0].clientY - b.top)};
	}
	return undefined;
};

App.prototype.touchStartHandler = function(e) {
	this.dragStart = this.getCanvasPosition(e);
	this.isDragging = true;
	e.preventDefault();
};

App.prototype.touchEndHandler = function(e) {
	var img = new Image();
	img.onload = function() {
		console.log('onload');
	};

	if (this.isDragging) {
		this.isDragging = false;
	}

	this.recognize();

	e.preventDefault();
};

App.prototype.touchMoveHandler = function(e) {
	if (this.isDragging) {
		var end = this.getCanvasPosition(e);
		var w = end.x - this.dragStart.x;
		var h = end.y - this.dragStart.y;

        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.dragStart.x, this.dragStart.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();

		this.dragStart = end;
	}
	e.preventDefault();
};

App.prototype.recognize = function() {
	const IMAGE_SIZE_S = 28;
	const resizeFactor = 4;

	var ctx = this.input.getContext('2d');
	var img = new Image();

	img.onload = function() {
		var inputs = [];
		var small = document.createElement('canvas').getContext('2d');
		small.drawImage(img, 0, 0, img.width, img.height, 0, 0, IMAGE_SIZE_S, IMAGE_SIZE_S);
		var data = small.getImageData(0, 0, IMAGE_SIZE_S, IMAGE_SIZE_S).data;
		console.log(data);
		for (var i = 0; i < IMAGE_SIZE_S; i++) {
			for (var j = 0; j < IMAGE_SIZE_S; j++) {
				var n = 4 * (i * IMAGE_SIZE_S + j);
				inputs[i * IMAGE_SIZE_S + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
				ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
				ctx.fillRect(j * resizeFactor, i * resizeFactor, resizeFactor, resizeFactor);
			}
		}
		document.createElement('div').appendChild(img);
		console.log(inputs);
	};
	img.src = this.canvas.toDataURL();
};

App.prototype.debug = function(s) {
	document.getElementById('debug').innerText += s + '\n';
};

App.prototype.progress = function(progress) {
	console.log(progress);
	if (progress.recognized !== undefined) {
		document.getElementById('progress').innerText = progress.recognized;
	} else {
		document.getElementById('progress').innerText = JSON.stringify(progress);
		this.debug(JSON.stringify(progress));
	}
};

window.onload = function() {
	var app = new App();
};

//////////////////////////////
App.prototype.loadFile = function() {
	var reader = new FileReader();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	reader.onload = function() {
		var image = new Image();
		image.onload = function() {
			var w = 320, h = 240;
			if (w/h > image.width/image.height) {
				h = parseInt(w*image.height/image.width);
			} else {
				w = parseInt(h*image.width/image.height);
			}

			console.log({w: w, h: h});

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.canvas.width = w;
			this.canvas.height = h;
			this.ctx.drawImage(image, 0, 0, w, h);

			this.debug("orig: " + image.width + " " + image.height);

			var img = this.ctx.getImageData(0, 0, w, h);
			Tesseract.recognize(img, {progress: this.progress.bind(this)}, function(err, result) {
				console.log(result);
				document.getElementById('transcription').innerText = result.text;
			});
		}.bind(this);
		image.src = reader.result;
	}.bind(this);
	reader.readAsDataURL(document.getElementById('picker').files[0]);
};

