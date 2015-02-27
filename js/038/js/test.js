var bgImage;
var bgImageCtx;

var fgImage;
var fgImageCtx;

var prevPos = {x:0, y:0};
var baseDistance = 0;
var boxPos = {x:0, y:0};

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
	fgImageCtx.fillRect(boxPos.x, boxPos.y, 80, 20);
	
    fgImage.addEventListener("touchstart", touchStartHandler, false);
    fgImage.addEventListener("touchmove", touchMoveHandler, false);
    fgImage.addEventListener("touchend", touchEndHandler, false);
    fgImage.addEventListener("mousedown", mouseDownHandler, false);
};

function moveBoxPos(dx, dy) {
	boxPos.x += dx;
	boxPos.y += dy;
	fgImageCtx.clearRect(0, 0, fgImage.width, fgImage.height);	
	fgImageCtx.fillRect(boxPos.x, boxPos.y, 80, 20);

	// set color
	//  get imageData object from canvas
    var imagedata = bgImageCtx.getImageData(0, 0, bgImage.width, bgImage.height);
	
    //  get pixelArray from imagedata object
    var data = imagedata.data;  
	
    //  calculate offset into array for pixel at mouseX/mouseY
    var i = ((boxPos.x * bgImage.width) + boxPos.y) * 4;
	
    //  get RGBA values
    var r = data[i];        
    var g = data[i+1];
    var b = data[i+2];

	document.getElementById("color_disp_0").style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
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
