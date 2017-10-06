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

	this.tick = 0;
	this.socket = io.connect('http://lab.schememono.net:8881');
	this.socket.on('log', function(d) {
		this.log.push(d.data);
		this.logDateFormat(this.log);
		this.drawGraph(this.log);
		this.tick ++;
	}.bind(this));
	this.socket.on('logreset', function() {
		this.log = [];
	}.bind(this));

	this.pro_history = JSON.parse(pro_history);
	this.logDateFormat(this.pro_history);
};

Apl.prototype.startSaving = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	this.sampleInterval = (parseInt($("#sampling-interval").val()) || 200);
	this.socket.emit('logreset');
	this.timer = setInterval(this.logDataPush.bind(this), this.sampleInterval);
	$('#save').text('stop');
	$('#save').off('click');
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
	$('#status').text('ready');
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

Apl.prototype.logDateFormat = function(data) {
	var parseTime = d3.timeParse('%Y/%m/%d %H:%M:%S.%L');	
	var beginDate = parseTime(data[0][0]);
	data.forEach(function(d) {
		d.date = parseTime(d[0]) - beginDate;
	});
};

Apl.prototype.drawGraph = function(data) {
	var svg = d3.select("svg");
	svg.selectAll('*')
		.remove();

	var svg = d3.select("svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//var parseTime = d3.timeParse("%d-%b-%y");
	//var parseTime = d3.timeParse('%Y/%m/%d %H:%M:%S.%L');
	//2017/10/05 18:02:55.251

	//var beginDate = parseTime(data[0][0]);
	//data.forEach(function(d) {
	//	d.date = parseTime(d[0]) - beginDate;
	//});

	var x = d3.scaleTime()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d[1]); });

	function drawLine(data) {
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([-10, 10]); // due to gravity data (-9.8 - +9.8)

		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.select(".domain")
			.remove();

		g.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("d", line);
	}
	drawLine(data);
};

var apl; // for debug
$(function() {
	apl = new Apl();
//	apl.drawGraph();
});
