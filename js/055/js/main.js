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
    // New Canvas
    canvas.width  = img.width;
    canvas.height = img.height;

	console.log(img.width);
	console.log(img.height);

    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // To Base64
    return canvas.toDataURL('image/jpeg').substr(23);
}

function post(data) {
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function() {
		const READYSTATE_COMPLETED = 4;
		if (this.readyState == READYSTATE_COMPLETED) {
			var result = document.getElementById('result');
			result.innerHTML = this.responseText;
		}
	}
	xmlHttpRequest.open('POST',
						'https://vision.googleapis.com/v1/images:annotate?key=' + apikey);
	// サーバに対して解析方法を指定する
	xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
	// データをリクエスト ボディに含めて送信する
	xmlHttpRequest.send(JSON.stringify(data));
}

function loadFile(files) {
	var canvas = document.getElementById('canvas-temp');
	var ctx = canvas.getContext('2d');
	var file = files.files[0];
	var reader = new FileReader();

	reader.onload = function() {
		var image = document.getElementById('img');
		image.src = reader.result;
	}.bind(this);
	reader.readAsDataURL(file);
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
	
	console.log(detectType);

	post(data);
}

