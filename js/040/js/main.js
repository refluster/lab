window.onload = function() {
	setTimeout(function() {
		document.getElementById("obj").className = " animating";
	}, 400);
	
	document.getElementById("obj").addEventListener("click", function(e) {
		console.log("clicked");
	});
};
