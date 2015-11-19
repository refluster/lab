function recognize_image(){
	document.getElementById('transcription').innerHTML = "(Recognizing...)";

	OCRAD(document.getElementById("pic"), {
		numeric: true
	}, function(text){

	});
}
function load_file () {
	var canvas = document.getElementById('canvas');
	console.log(canvas);
	var ctx = canvas.getContext('2d');
	canvas.width = canvas.height = 0;

	var reader = new FileReader();
	reader.onload = function(){
		var image = new Image();
		image.onload = function(){
			var w = 320, h = 240;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = w;
			canvas.height = h;
			ctx.drawImage(image, 0, 0, w, h);

			document.getElementById('text').innerHTML = "orig: " + image.width + " " + image.height;

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
