var App = function() {
	this.canvas = document.getElementById('bgImage');
	this.ctx = this.canvas.getContext('2d');

	this.canvas.width = this.canvas.height = 0;
	document.getElementById('picker').onchange = this.loadFile.bind(this);

	this.fgImage = document.getElementById("fgImage");
	this.fgContext = fgImage.getContext("2d");

	this.fgImage.style.opacity = 0.4;
	this.fgContext.fillStyle = "rgb(180,0,0)";

	this.fgImage.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
	this.fgImage.addEventListener("touchmove", this.touchMoveHandler.bind(this), false);
	this.fgImage.addEventListener("touchend", this.touchEndHandler.bind(this), false);

	this.isDragging = false;
};

App.prototype.loadFile = function() {
	var reader = new FileReader();
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

			document.getElementById('text').innerHTML = "orig: " + image.width + " " + image.height;

			var img = this.ctx.getImageData(0, 0, w, h);
			Tesseract.recognize(img, function(err, result) {
				console.log(result);
				document.getElementById('transcription').innerText = result.text;
			});
		}.bind(this);
		image.src = reader.result;
	}.bind(this);
	reader.readAsDataURL(document.getElementById('picker').files[0]);
};

App.prototype.getCanvasPosition = function(e) {
	if (e.touches.length > 0) {
		var b = this.fgImage.getBoundingClientRect();
		return {x: parseInt(e.touches[0].pageX - b.left),
				y: parseInt(e.touches[0].pageY - b.top)};
	} else {
		return {x: parseInt(e.pageX),
				y: parseInt(e.pageY)};
	}
};

App.prototype.touchStartHandler = function(e) {
	this.dragStart = this.getCanvasPosition(e);
	this.isDragging = true;
	e.preventDefault();
};

App.prototype.touchEndHandler = function(e) {
	if (this.isDragging) {
		this.isDragging = false;
	}
	e.preventDefault();
};

App.prototype.touchMoveHandler = function(e) {
	if (this.isDragging) {
		var p = this.getCanvasPosition(e);
		var w = p.x - this.dragStart.x;
		var h = p.y - this.dragStart.y;
		this.fgContext.clearRect(0, 0, this.fgImage.width, this.fgImage.height);
		this.fgContext.fillRect(this.dragStart.x, this.dragStart.y, w, h);
		//this.fgContext.fillRect(10, 10, 100, -150);
		console.log({l: this.dragStart.x, u: this.dragStart.y, w: w, h: h});
	}
	e.preventDefault();
};

window.onload = function() {
	var app = new App();
};
