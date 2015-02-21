function toColor(colorData) {
	return 'rgb(' +
		parseInt(colorData.r*colorData.val) + ',' +
		parseInt(colorData.g*colorData.val) + ',' +
		parseInt(colorData.b*colorData.val) + ')';
}

var msg;
var colorData = {r: 0, g: 0, b: 0, val: 1};
var baseDistance;

// ½é´ü²½
function init() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var color = document.getElementById("color");
	
	msg = document.getElementById("msg");
	
	var image = new Image();
	
	canvas.addEventListener("touchstart", touchStartHandler, false);
	canvas.addEventListener("touchmove", touchMoveHandler, false);
	canvas.addEventListener("touchend", touchEndHandler, false);
	
	canvas.addEventListener("mousedown", mouseDownHandler, false);

	image.src = "color.jpg";
	image.onload = function() {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
	}
}

function showPosition(event) {
	document.getElementById("touchnum").innerHTML = event.touches.length;

	for (var i = 0; i < 2; i++) {
		if (event.touches[i]) {
			var x, y;
			x = event.touches[i].pageX - canvas.offsetTop;
			y = event.touches[i].pageY - canvas.offsetLeft;
			document.getElementById("loc" + i + "_x").innerHTML = x;
			document.getElementById("loc" + i + "_y").innerHTML = y;
		} else {
			document.getElementById("loc" + i + "_x").innerHTML = '';
			document.getElementById("loc" + i + "_y").innerHTML = '';
		}
	}
}

function changeHueSaturation(x, y) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var imagedata = context.getImageData(x, y, 1, 1);
	var data = Array.prototype.slice.apply(imagedata.data);
	var color = document.getElementById("color");
	
	colorData.r = data[0];
	colorData.g = data[1];
	colorData.b = data[2];
	console.log(colorData);
	color.style.backgroundColor = toColor(colorData);
	//document.bgColor = toColor(colorData);
}

function changeValue(inc) {
	colorData.val += inc;
	if (colorData.val > 1.0) {
		colorData.val = 1;
	} else if (colorData.val < 0.0) {
		colorData.val = 0;
	}
	color.style.backgroundColor = toColor(colorData);
}

function touchStartHandler(event) {
	if (event.touches.length == 1) {
		changeHueSaturation(event.touches[0].pageX - canvas.offsetTop,
							event.touches[0].pageY - canvas.offsetLeft);
	} else {
		baseDistance = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX)*
								 (event.touches[0].pageX - event.touches[1].pageX) + 
								 (event.touches[0].pageY - event.touches[1].pageY)*
								 (event.touches[0].pageY - event.touches[1].pageY));
	}

	showPosition(event);
	event.preventDefault();
}

function touchMoveHandler(event) {
	var canvas = document.getElementById("canvas");

	if (event.touches.length == 1) {
		changeHueSaturation(event.touches[0].pageX - canvas.offsetTop,
							event.touches[0].pageY - canvas.offsetLeft);
		
	} else {
		var newDistance = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX)*
								 (event.touches[0].pageX - event.touches[1].pageX) + 
								 (event.touches[0].pageY - event.touches[1].pageY)*
								   (event.touches[0].pageY - event.touches[1].pageY));
		var coe = 0.005;
		changeValue((newDistance - baseDistance)*coe);
		msg.innerHTML = "base : " + baseDistance + ", new : " + newDistance + ', val : ' + (newDistance - baseDistance)*coe;
		baseDistance = newDistance;
	}

	showPosition(event);
	event.preventDefault();
}

function touchEndHandler(event) {
	msg.innerHTML = "";
	
	showPosition(event);
	event.preventDefault();
}

function mouseDownHandler(event) {
	changeHueSaturation(event.pageX - canvas.offsetTop,
						event.pageY - canvas.offsetLeft);
}
