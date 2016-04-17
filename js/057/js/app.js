var App = function() {
	this.canvas = document.getElementById('canvas');
	this.input = document.getElementById('input');
	this.btnClear = document.getElementById('btn-clear');
	this.canvas.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
	this.canvas.addEventListener("touchmove", this.touchMoveHandler.bind(this), false);
	this.canvas.addEventListener("touchend", this.touchEndHandler.bind(this), false);
	this.canvas.addEventListener("mousedown", this.touchStartHandler.bind(this), false);
	this.canvas.addEventListener("mousemove", this.touchMoveHandler.bind(this), false);
	this.canvas.addEventListener("mouseup", this.touchEndHandler.bind(this), false);
	this.btnClear.addEventListener("click", this.clearCanvas.bind(this), false);	

	this.isDragging = false;

	this.ctx = this.canvas.getContext('2d');
	this.clearCanvas();
};

App.prototype.clearCanvas = function(e) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
};

App.prototype.getCanvasPosition = function(e) {
	var b = this.canvas.getClientRects()[0];
	if (e.clientX !== undefined) {
		return {x: parseInt(e.clientX - b.left),
				y: parseInt(e.clientY - b.top)};
	} else if (e.touches.length > 0) {
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
	const RESIZE_FACTOR = 4;

	var ctx = this.input.getContext('2d');
	var img = new Image();

	img.onload = function() {
		var inputs = [];
		var small = document.createElement('canvas').getContext('2d');
		small.drawImage(img, 0, 0, img.width, img.height, 0, 0, IMAGE_SIZE_S, IMAGE_SIZE_S);
		var data = small.getImageData(0, 0, IMAGE_SIZE_S, IMAGE_SIZE_S).data;
		for (var i = 0; i < IMAGE_SIZE_S; i++) {
			for (var j = 0; j < IMAGE_SIZE_S; j++) {
				var n = 4 * (i * IMAGE_SIZE_S + j);
				inputs[i * IMAGE_SIZE_S + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
				ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
				ctx.fillRect(j * RESIZE_FACTOR, i * RESIZE_FACTOR, RESIZE_FACTOR, RESIZE_FACTOR);
			}
		}
		document.createElement('div').appendChild(img);

		function webapi(api, id) {
			var xmlHttpRequest = new XMLHttpRequest();
			for (var i = 0; i < 10; i++) {
				document.getElementById(id + i).innerHTML = '';
			}
			xmlHttpRequest.onreadystatechange = function() {
				var READYSTATE_COMPLETED = 4;
				var HTTP_STATUS_OK = 200;
				if( this.readyState == READYSTATE_COMPLETED
					&& this.status == HTTP_STATUS_OK ) {
					d = JSON.parse(this.responseText);
					console.log(d);
					for (var i = 0; i < 10; i++) {
						document.getElementById(id + i).innerHTML = d[i];
					}
				}
			}
			xmlHttpRequest.open('POST', api);
			xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
			xmlHttpRequest.send(JSON.stringify([inputs]));
		}
		webapi('./simple.cgi', 'simple');
		webapi('./convolutional.cgi', 'convolutional');
	};

	img.src = this.canvas.toDataURL();
};

window.onload = function() {
	var app = new App();
};
