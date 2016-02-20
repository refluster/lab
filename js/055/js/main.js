/*
var Apl = function() {
};	

$(function() {
	var apl = new Apl();
});
*/


function ImageToBase64(img) {
    // New Canvas
    var canvas = document.getElementById('canvas-temp');
    canvas.width  = img.width;
    canvas.height = img.height;
    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // To Base64
    return canvas.toDataURL('image/jpeg').substr(23);
}

function post(data) {
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function() {
		var READYSTATE_COMPLETED = 4;
		var HTTP_STATUS_OK = 200;
		
		if( this.readyState == READYSTATE_COMPLETED
			&& this.status == HTTP_STATUS_OK ) {
			// レスポンスの表示
			alert( this.responseText );
		} else {
			alert( this.responseText );
		}
	}
	xmlHttpRequest.open( 'POST', 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA_83j8DMAW9rJ38uczalFkfpL5lV6ito4');
	// サーバに対して解析方法を指定する
	xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/json' );
	// データをリクエスト ボディに含めて送信する
	xmlHttpRequest.send(JSON.stringify(data));
}

function hoge() {
	var img = document.getElementById('img');

	var base64 = ImageToBase64(img);
	var data = {
		"requests":[
			{
				"image":{
					"content":base64
				},
				"features":[
					{
						"type":"LABEL_DETECTION",
						"maxResults":1
					}
				]
			}
		]
	};
	
	post(data);
}

