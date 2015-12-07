var bgImage;
var bgImageCtx;

var fgImage;
var fgImageCtx;

var prevPos = {x:0, y:0};
var baseDistance = 0;
var boxPos = {x:0, y:0};

var boxWidth = 80;

window.onload = function() {
	bgImage = document.getElementById("bgImage");
	bgImageCtx = bgImage.getContext("2d");

	fgImage = document.getElementById("fgImage");
	fgImageCtx = fgImage.getContext("2d");

    var img = new Image();

    img.src = 'img/test.jpg';	
    img.onload = function() {
        bgImageCtx.drawImage(img, 0, 0, bgImage.width, bgImage.height);
    };

	fgImage.style.opacity = 0.4;
	fgImageCtx.fillStyle = "rgb(180,0,0)";
	fgImageCtx.fillRect(boxPos.x, boxPos.y, boxWidth, 5);
	
    fgImage.addEventListener("touchstart", touchStartHandler, false);
    fgImage.addEventListener("touchmove", touchMoveHandler, false);
    fgImage.addEventListener("touchend", touchEndHandler, false);
    fgImage.addEventListener("mousedown", mouseDownHandler, false);
};

function toRgbString(r, g, b) {
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function moveBoxPos(dx, dy) {
	boxPos.x += dx;
	boxPos.y += dy;
	fgImageCtx.clearRect(0, 0, fgImage.width, fgImage.height);	
	fgImageCtx.fillRect(boxPos.x, boxPos.y, boxWidth, 5);

	// set color
	//  get imageData object from canvas
    var imagedata = bgImageCtx.getImageData(0, 0, bgImage.width, bgImage.height);
	
    //  get pixelArray from imagedata object
    var data = imagedata.data;  
	
    //  calculate offset into array for pixel at mouseX/mouseY
    var dbase = ((boxPos.x * bgImage.width) + boxPos.y) * 4;
	
	for (var i = 0; i < 5; i++) {
		//  get RGBA values
		var r = data[((boxPos.y * bgImage.width) + boxPos.x + i*boxWidth/5) * 4 + 0];
		var g = data[((boxPos.y * bgImage.width) + boxPos.x + i*boxWidth/5) * 4 + 1];
		var b = data[((boxPos.y * bgImage.width) + boxPos.x + i*boxWidth/5) * 4 + 2];
		
		document.getElementById("color_disp_" + i).style.backgroundColor = toRgbString(r, g, b);
	}
}

function touchStartHandler(event) {
    if (event.touches.length == 1) {
        var rect = event.target.getBoundingClientRect();
        var x = event.touches[0].clientX - rect.left;
        var y = event.touches[0].clientY - rect.top;

        prevPos.x = x;
		prevPos.y = y;
    } else {
        baseDistance = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX)*
                                 (event.touches[0].pageX - event.touches[1].pageX) +
                                 (event.touches[0].pageY - event.touches[1].pageY)*
                                 (event.touches[0].pageY - event.touches[1].pageY));
    }
	
    event.preventDefault();
}

function touchMoveHandler(event) {
	if (event.touches.length == 1) {
		var rect = event.target.getBoundingClientRect();
		var x = event.touches[0].clientX - rect.left;
		var y = event.touches[0].clientY - rect.top;
		moveBoxPos(x - prevPos.x, y - prevPos.y);
        prevPos.x = x;
		prevPos.y = y;
	} else {
		var newDistance = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX)*
									(event.touches[0].pageX - event.touches[1].pageX) + 
									(event.touches[0].pageY - event.touches[1].pageY)*
									(event.touches[0].pageY - event.touches[1].pageY));
		console.log("d: " + baseDistance);
		baseDistance = newDistance;
	}
	
	event.preventDefault();
}

function touchEndHandler(event) {
    event.preventDefault();
}

function mouseDownHandler(event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

	moveBoxPos(x - prevPos.x, y - prevPos.y);
	prevPos.x = x;
	prevPos.y = y;
}
