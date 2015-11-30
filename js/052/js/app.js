var App = function() {
	this.canvas = document.getElementById('bgImage');
	this.ctx = this.canvas.getContext('2d');

	this.canvas.width = this.canvas.height = 0;
	document.getElementById('picker').onchange = this.loadFile.bind(this);
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

			var im = this.ctx.getImageData(0, 0, w, h);
			this.ctx.putImageData(im, 0, 0);

			var img = document.createElement('img');
			img.src = this.canvas.toDataURL();

			img.onload = function() {
				Tesseract.recognize(img, function(err, result) {
					console.log(result);
					document.getElementById('transcription').innerText = result.text;
				});
			};
		}.bind(this)
		image.src = reader.result;
	}.bind(this)
	reader.readAsDataURL(document.getElementById('picker').files[0])
};

window.onload = function() {
	var app = new App();
};
