function load_file () {
	//var canvas = document.getElementById('canvas');
	var canvas = document.getElementById('bgImage');
	var ctx = canvas.getContext('2d');

	canvas.width = canvas.height = 0;

	var reader = new FileReader();
	reader.onload = function(){
		var image = new Image();
		image.onload = function(){
			var w = 320, h = 240;

			if (w/h > image.width/image.height) {
				h = parseInt(w*image.height/image.width);
			} else {
				w = parseInt(h*image.width/image.height);
			}

			var smooth = new Uint8ClampedArray(w*h*4);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			canvas.width = w;
			canvas.height = h;
			ctx.drawImage(image, 0, 0, w, h);

			document.getElementById('text').innerHTML = "orig: " + image.width + " " + image.height;

			var im = ctx.getImageData(0, 0, w, h);
			// filter
			//filter(im.data, smooth, w, h);
			//im.data.set(smooth);

			ctx.putImageData(im, 0, 0);

			var img = document.createElement('img');
			img.src = canvas.toDataURL();

			img.onload = function() {
                // ocrad
				//OCRAD(img, function(text){
				//	document.getElementById('transcription').className = "done"
				//	document.getElementById('transcription').innerText = text;
				//});

				Tesseract.recognize(img, function(err, result) {
					console.log(result);
					document.getElementById('transcription').innerText = result.text;
				});
			};
		}
		image.src = reader.result;
	}
	reader.readAsDataURL(document.getElementById('picker').files[0])
}

function filter2d(src, dst, w, h, k) {
	var x, y, i;

	for (i = 0; i < h; i++) {
		for (j = 0; j < w; j++) {
			var dx = (j + i * w) * 4;
			var val = [0,0,0];
			for(var v = -1; v <= 1; v++){
				for(var l = -1; l <= 1 ; l++){
					x = j + l;
					y = i + v;
					if(x < 0 || x >= w || y < 0 || y >= h){
						continue;
					}
					var dx1 = (x + y * w) * 4;
					var dx2 = (l + 1) + (v + 1)*3;
					val[0] += k[dx2]*src[dx1];
					val[1] += k[dx2]*src[dx1 + 1];
					val[2] += k[dx2]*src[dx1 + 2];
				}
			}
			dst[dx] = val[0];
			dst[dx + 1] = val[1];
			dst[dx + 2] = val[2];
			dst[dx + 3] = src[dx + 3];
		}
	}
}

function filter(src, dst, w, h) {
	var x, y, i;
	var r = [];
	var g = [];
	var b = [];

	var median = function(arr) {
		var half = (arr.length/2)|0;
		var temp = arr.sort();

		if (temp.length%2) {
			return temp[half];
		}

		return (temp[half-1] + temp[half])/2;
	};

	for (i = 0; i < h; i++) {
		for (j = 0; j < w; j++) {
			var p = j + i * w;
			r[p] = src[p*4 + 0];
			g[p] = src[p*4 + 1];
			b[p] = src[p*4 + 2];
		}
	}

	var th_r = parseInt(median(r) * .8);
	var th_g = parseInt(median(g) * .8);
	var th_b = parseInt(median(b) * .8);

	for (i = 0; i < h; i++) {
		for (j = 0; j < w; j++) {
			var p = j + i * w;
			if (src[p*4 + 0] > th_r &&
				src[p*4 + 1] > th_g &&
				src[p*4 + 2] > th_b) {
				dst[p*4 + 0] = 255;
				dst[p*4 + 1] = 255;
				dst[p*4 + 2] = 255;
			} else {
				dst[p*4 + 0] = 0;
				dst[p*4 + 1] = 0;
				dst[p*4 + 2] = 0;
			}				
			dst[p*4 + 3] = 255;
		}
	}
}
