var ratio = 0.93;

// draw rect
function drawRectCol(context, bx, by, width, height, iniDist) {
	var cx, cy;
	var length;
	var distance;

	cx = bx;
	cy = by;
	distance = iniDist;
	length = iniDist*0.6;
	
	for (var i = 0; i < 100; i++) {
		context.beginPath();
		context.moveTo(cx, cy - length/2);
        context.lineTo(cx - length/2, cy);
        context.lineTo(cx, cy + length/2);
        context.lineTo(cx + length/2, cy);
        context.closePath();
        context.fill();
		
		distance *= ratio;
		length *= ratio;
		cy += distance;

		if (length < 1 || cy > height) {
			break;
		}
	}
}

// draw rect
function drawRectSin(context, bx, by, width, height, iniDist) {
	var cx, cy;
	var length;
	var distance;
//	var ratio = 0.97;

	cx = bx;
	cy = by + 40*Math.sin(-(cx - bx)/50);
	distance = iniDist;
	length = iniDist*0.6;
	
	for (var i = 0; i < 100; i++) {
		context.beginPath();
		context.moveTo(cx, cy - length/2);
        context.lineTo(cx - length/2, cy);
        context.lineTo(cx, cy + length/2);
        context.lineTo(cx + length/2, cy);
        context.closePath();
        context.fill();
		
		distance *= ratio;
		length *= ratio;
		cx = cx + distance;
		cy = by + 40*Math.sin(-(cx - bx)/50);

		if (length < 1 || cx > width || cy > height) {
			break;
		}
	}
}

function draw() {
	// get canvas
	var canvas = document.getElementById('canvas');
	
	if (canvas.getContext) {
		var context = canvas.getContext('2d');

		// set color
		context.fillStyle = 'rgb(255,138,0)';

		// draw rectangle column
		ratio = 0.93;
		for (var i = true, x = 20; x < canvas.width; i = !i, x += 15) {
			if (i == 0) {
				drawRectCol(context, x, 20, canvas.width, canvas.height, 30);
			} else {
				drawRectCol(context, x, 20 + 30/2*ratio, canvas.width, canvas.height, 30*(1-(1-ratio)/2));
			}
		}
		
		// draw rectangle sin curve
		ratio = 0.97;
		for (var x = 20, y = 300; x < 500; x += 10, y += 24) {
			drawRectSin(context, x, y, canvas.width, canvas.height, 15);
		}
		
	} 
	console.log('done');
}
