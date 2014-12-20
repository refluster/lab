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
//				context.fillRect(cx - length/2, cy - length/2, length, length);
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

function sample() {
	// get canvas
	var canvas = document.getElementById('sample1');
	
	if (canvas.getContext) {
		var context = canvas.getContext('2d');

		// set color
		context.fillStyle = 'rgb(255,138,0)';
		//context.strokeStyle = 'rgb(255,255,255)';

		for (var i = true, x = 20; x < canvas.width; i = !i, x += 15) {
			if (i == 0) {
				drawRectCol(context, x, 20, canvas.width, canvas.height, 30);
			} else {
				drawRectCol(context, x, 20 + 30/2*ratio, canvas.width, canvas.height, 30*(1-(1-ratio)/2));
			}
		}

		console.log('done');
	} 
}

