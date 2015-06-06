function displaySpace() {
	var w = $("#page-space").width();
	var h = $("#page-space").height();
	var size = (w > h)? h: w;

	$("#space").css("height", size + 'px');
	$("#space").css("width", size + 'px');

	console.log(size);
}

window.onload = function() {
	displaySpace();
};

