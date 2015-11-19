function load_file () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
/*
    var kernel = [0.11,0.11,0.11,
                  0.11,0.12,0.11,
                  0.11,0.12,0.11];
*/
    var kernel = [0.05,0.10,0.05,
                  0.08,0.13,0.08,
                  0.05,0.10,0.05];

	canvas.width = canvas.height = 0;

	var reader = new FileReader();
	reader.onload = function(){
		var image = new Image();
		image.onload = function(){
			var w = 320, h = 240;
			var smooth = new Uint8ClampedArray(w*h*4);      // 出力画像格納用

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = w;
			canvas.height = h;
			ctx.drawImage(image, 0, 0, w, h);

			document.getElementById('text').innerHTML = "orig: " + image.width + " " + image.height;

			var im = ctx.getImageData(0, 0, w, h);  // canvusから画像データを取得
			//filter2d(im.data, smooth, w, h, kernel); // 画像にフィルタ処理
			bin(im.data, smooth, w, h); // 画像にフィルタ処理
			im.data.set(smooth);
			ctx.putImageData(im, 0, 0);

			var img = document.createElement('img');
			img.src = canvas.toDataURL();

			img.onload = function() {
				document.getElementById('nose').innerHTML = ''
				document.getElementById('nose').appendChild(img)
				OCRAD(img, function(text){
					document.getElementById('transcription').className = "done"
					document.getElementById('transcription').innerText = "result: " + text;
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

function bin(src, dst, w, h) {
	var x, y, i;
	var r = [];
	var g = [];
	var b = [];

	for (i = 0; i < h; i++) {
		for (j = 0; j < w; j++) {
			var p = j + i * w;
			r[p] = src[p*4 + 0];
			g[p] = src[p*4 + 1];
			b[p] = src[p*4 + 2];
		}
	}

	var median = function(arr) {
		var half = (arr.length/2)|0;
		var temp = arr.sort();

		if (temp.length%2) {
			return temp[half];
		}

		return (temp[half-1] + temp[half])/2;
	};

	var med_r = median(r);
	var med_g = median(g);
	var med_b = median(b);

	console.log(med_r);
	console.log(med_g);
	console.log(med_b);

	var th_r = parseInt(med_r * .8);
	var th_g = parseInt(med_g * .8);
	var th_b = parseInt(med_b * .8);

	for (i = 0; i < h; i++) {
		for (j = 0; j < w; j++) {
			var p = j + i * w;
			dst[p*4 + 0] = (src[p*4 + 0] > th_r ? 255: 0);
			dst[p*4 + 1] = (src[p*4 + 1] > th_g ? 255: 0);
			dst[p*4 + 2] = (src[p*4 + 2] > th_b ? 255: 0);
			dst[p*4 + 3] = 255;
		}
	}

	console.log(th_r);
	console.log(th_g);
	console.log(th_b);
}
