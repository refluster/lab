$(function(){
	var socket = new io.connect("http://183.181.8.119:8080");

	socket.on("connect", function(){
	});

	socket.on("message", function(data){
		var date = new Date;
		var li = $("<li>");
		li.html(li.text(data.message).html() 
				+ '<small style="margin-left:30px;color:#a0a0a0"> by '
				+ data.name + ' at ' + date.toString() + '</small>');
		li.prependTo($("#messageArea ul"));
	});

	$("#messageForm").submit(function(){
		socket.emit("message", {message: $("#msg").val(), name: $("#name").val()});
		$("#msg").val('');
		return false;
	});

	socket.on('user connected', function (data) {
		jQuery('#member_count').html(data);
	});

	socket.on('user disconnected', function (data) {
		jQuery('#member_count').html(data);
	});
});
