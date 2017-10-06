Apl = function() {
	this.log = [];
	this.ePointers = {
		devicemotion: {
			accelerationIncludingGravity: {x: '-', y: '-', z: '-'},
			acceleration: {x: '-', y: '-', z: '-'},
			rotationRate: {alpha: '-', beta: '-', gamma: '-'}},
        deviceorientation: {absolute: '-', alpha: '-', beta: '-', gamma: '-'},
        devicelight: {value: '-'},
        deviceproximity: {max: '-', min: '-', value: '-'},
	};

	$('#save').on('click', this.startSensing.bind(this));

	var d = $('#sense tbody');
	d.append('<tr><td>acceleration including gravity</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>acceleration</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>rotation rate</td>' +
			 '<td>' + (window.DeviceMotionEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>gyroscope</td>' +
			 '<td>' + (window.DeviceOrientationEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>ambient light</td>' +
			 '<td>' + (window.DeviceLightEvent? 'ok': '-') + '</td></tr>');
	d.append('<tr><td>proximity</td>' +
			 '<td>' + (window.DeviceProximityEvent? 'ok': '-') + '</td></tr>');

	$('#status').text('ready');

	this.tick = 0;
	this.sampleInterval = 200; // msec
	this.pro_history = JSON.parse(pro_history);
	this.logDateFormat(this.pro_history);
	this.drawGraph(this.tick*this.sampleInterval - 2000, this.tick*this.sampleInterval + 6000);

	this.socket = io.connect('http://lab.schememono.net:8881');
	this.socket.on('log', function(d) {
		this.log.push(d.data);
		this.logDateFormat(this.log);
		this.drawGraph(this.tick*this.sampleInterval - 2000, this.tick*this.sampleInterval + 6000);
		this.tick ++;
	}.bind(this));
	this.socket.on('logreset', function() {
		this.tick = 0;
		this.log = [];
	}.bind(this));
};

Apl.prototype.startSensing = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).on('devicemotion', function(e) {
			this.ePointers.devicemotion = e.originalEvent;
		}.bind(this));
	}
	if (window.DeviceOrientationEvent) {
		$(window).on('deviceorientation', function(e) {
			this.ePointers.deviceorientation = e.originalEvent;
		}.bind(this));
	}
	if (window.DeviceLightEvent) {
		$(window).on('devicelight', function(e) {
			this.ePointers.devicelight = e.originalEvent;
		}.bind(this));
	}
	if (window.DeviceProximityEvent) {
		$(window).on('deviceproximity', function(e) {
			this.ePointers.deviceproximity = e.originalEvent;
		}.bind(this));
	}
	this.socket.emit('logreset');
	this.timer = setInterval(this.logDataPush.bind(this), this.sampleInterval);
	$('#save').text('stop');
	$('#save').off('click');
	$('#save').on('click', this.stopSensing.bind(this));
	$('#status').text('sampling');
};

Apl.prototype.stopSensing = function(e) {
	if (window.DeviceMotionEvent) {
		$(window).off('devicemotion');
	}
	if (window.DeviceOrientationEvent) {
		$(window).off('deviceorientation');
	}
	if (window.DeviceLightEvent) {
		$(window).off('devicelight');
	}
	if (window.DeviceProximityEvent) {
		$(window).off('deviceproximity');
	}
	clearInterval(this.timer);
	$('#save').text('start');
	$('#save').off('click');
	$('#save').on('click', this.startSensing.bind(this));
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
		this.ePointers.devicemotion.rotationRate.gamma,
		this.ePointers.deviceorientation.absolute,
		this.ePointers.deviceorientation.alpha,
		this.ePointers.deviceorientation.beta,
		this.ePointers.deviceorientation.gamma,
		this.ePointers.devicelight.value,
		this.ePointers.deviceproximity.max,
		this.ePointers.deviceproximity.min,
		this.ePointers.deviceproximity.value,
	];
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

Apl.prototype.drawGraph = function(start, end) {
	var svg = d3.select("svg");
	svg.selectAll('*')
		.remove();

	var svg = d3.select("svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var line = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d[1]); });

	function drawLine(data) {
		x.domain([start, end]);
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
	drawLine(this.log);
	drawLine(this.pro_history);
};

var apl; // for debug
$(function() {
	apl = new Apl();
});
