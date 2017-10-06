Apl = function() {
	this.log = [];
	this.ePointers = {
		devicemotion: {
			accelerationIncludingGravity: {x: '-', y: '-', z: '-'},
			acceleration: {x: '-', y: '-', z: '-'},
			rotationRate: {alpha: '-', beta: '-', gamma: '-'}},
	};

	$('#save').on('click', this.startSaving.bind(this));

	var d = $('#sense tbody');
	d.append('<tr><td>acceleration including gravity</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>acceleration</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>rotation rate</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');

	$('#status').text('ready');

	this.socket = io.connect('http://lab.schememono.net:8881');
	this.socket.on('log', function(d) {
		console.log(d);
		this.log.push(d.data);
	}.bind(this));
	this.socket.on('logreset', function() {
		console.log('log reset');
		this.log = [];
	}.bind(this));
};

Apl.prototype.startSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	var sampleInterval = (parseInt($("#sampling-interval").val()) || 200);
	this.socket.emit('logreset');
	this.timer = setInterval(this.logDataPush.bind(this), sampleInterval);
	$('#save').text('stop');
	//$('#save').off('click');
	$('#save').on('click', this.stopSaving.bind(this));
	$('#status').text('sampling');
};

Apl.prototype.stopSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).off('devicemotion');
	}
	clearInterval(this.timer);
	$('#save').off('click');
	$('#save').on('click', this.startSaving.bind(this));
	$('#save').text('start');
};

Apl.prototype.logDataPush = function() {
	var date = new Date();
	var dateStr = date.getFullYear() + '/' +
		('0' + (date.getMonth() + 1)).slice(-2) + '/' +
		('0' + date.getDate()).slice(-2) + ' ' +
		('0' + date.getHours()).slice(-2)  + ':' +
		('0' + date.getMinutes()).slice(-2)  + ':' +
		('0' + date.getSeconds()).slice(-2)  + '.' +
		('0' + date.getMilliseconds()).slice(-3);
	var newRecord = [
		dateStr,
		this.ePointers.devicemotion.accelerationIncludingGravity.x,
		this.ePointers.devicemotion.accelerationIncludingGravity.y,
		this.ePointers.devicemotion.accelerationIncludingGravity.z,
		this.ePointers.devicemotion.acceleration.x,
		this.ePointers.devicemotion.acceleration.y,
		this.ePointers.devicemotion.acceleration.z,
		this.ePointers.devicemotion.rotationRate.alpha,
		this.ePointers.devicemotion.rotationRate.beta,
		this.ePointers.devicemotion.rotationRate.gamma];
	this.socket.emit('collect', {
		data: newRecord
	});
};

Apl.prototype.drawGraph = function() {
	var svg = d3.select("svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%d-%b-%y");

	var x = d3.scaleTime()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var line = d3.line()
		.x(function(d) { return x(d[0]); })
		.y(function(d) { return y(d[1]); });

/*
	d3.csv("data.csv", function(d) {
		d.date = parseTime(d.date);
		d.close = +d.close;
		return d;
	}, function(error, data) {
*/
	var data = [
		[.1, .3],
		[.2, .2],
		[.3, .3],
		[.4, .4],
		[.5, .5],
		[3.6, .7],
	];
	
	{
		x.domain(d3.extent(data, function(d) { console.log(d); return d[0]; }));
		y.domain(d3.extent(data, function(d) { return d[1]; }));

		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.select(".domain")
			.remove();

		g.append("g")
			.call(d3.axisLeft(y))
			.append("text")
			.attr("fill", "#000")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Price ($)");

		g.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("d", line);
	}
};

var apl; // for debug
$(function() {
	apl = new Apl();
	apl.drawGraph();
});
