/*
var Apl = function() {
};	

$(function() {
	var apl = new Apl();
});
*/

const apikey = 'AIzaSyA_83j8DMAW9rJ38uczalFkfpL5lV6ito4';

function ImageToBase64(img) {
	var canvas = document.getElementById('canvas-temp');
	return canvas.toDataURL('image/jpeg').substr(23);
}

function post(data) {
	var xmlHttpRequest = new XMLHttpRequest();
	result.innerHTML = 'analysing ...';
	xmlHttpRequest.onreadystatechange = function() {
		const READYSTATE_COMPLETED = 4;
		if (this.readyState == READYSTATE_COMPLETED) {
			var result = document.getElementById('result');
			result.innerHTML = this.responseText;
		}
	}
	xmlHttpRequest.open('POST',
						'https://vision.googleapis.com/v1/images:annotate?key=' + apikey);
	xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
	xmlHttpRequest.send(JSON.stringify(data));
}

function imageUpdate(src) {
	var image = document.getElementById('img');
	image.onload = function() {
		var canvas = document.getElementById('canvas-temp');
		var ctx = canvas.getContext('2d');
		canvas.width  = image.width;
		canvas.height = image.height;
		ctx.drawImage(image, 0, 0);
	};
	image.src = src;
}	

function loadFile(files) {
	var selectedFile = document.getElementById('selected-file');
	var canvas = document.getElementById('canvas-temp');
	var ctx = canvas.getContext('2d');
	var file = files.files[0];
	var reader = new FileReader();

	selectedFile.value = file.name;
	reader.onload = function() {
		imageUpdate(reader.result);
	}.bind(this);
	reader.readAsDataURL(file);
}

function selectFile() {
	document.getElementById('file').click();
}

function analyse() {
	var img = document.getElementById('img');
	var detectType = document.getElementById('detect-type').value;
	var base64 = ImageToBase64(img);
	var data = {
		"requests":[
			{
				"image":{
					"content": base64
				},
				"features":[
					{
						"type": detectType,
						"maxResults": 1
					}
				]
			}
		]
	};
	
	post(data);
}
