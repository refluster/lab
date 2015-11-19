function recognize_image(){
	document.getElementById('transcription').innerHTML = "(Recognizing...)";

	OCRAD(document.getElementById("pic"), {
		numeric: true
	}, function(text){

	});
}
function load_file () {
	var reader = new FileReader();
	reader.onload = function(){
		var img = new Image();
		img.src = reader.result;
		img.onload = function(){
			document.getElementById('nose').innerHTML = ''
			document.getElementById('nose').appendChild(img)
			OCRAD(img, function(text){
				document.getElementById('transcription').className = "done"
				document.getElementById('transcription').innerText = text;
			})
		}
	}
	reader.readAsDataURL(document.getElementById('picker').files[0])
}
