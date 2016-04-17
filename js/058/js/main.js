var Graph = function() {
	//N 33.674711390010856、E 132.52676725387573、S 31.358987471317462、W 129.01114225387573

	$('#map').css('height', $('#map').width()*499/638);

	this.svg = d3.select("#map")
		.attr("width", $('#map').width())
		.attr("height", $('#map').height());

	this.dataReset();
	this.xScale = d3.scale.linear()
		.domain([129.01114225387573, 132.52676725387573])
		.range([0, $('#map').width()]);
	this.yScale = d3.scale.linear()
		.domain([31.358987471317462, 33.674711390010856])
		.range([$('#map').height(), 0]);
	this.colorScale = d3.scale.linear()
		.domain([1, 8])
		.range(["yellow","red"]);
};

Graph.prototype.dataReset = function() {
	var today = new Date().getDate();

	this.data = [];
	for (var year = 2016; year < 2017; year ++) {
		for (var month = 4; month < 5; month ++) {
			for (var day = 14; day < today + 1; day ++) {
				for (var hour = 0; hour < 24; hour ++) {
					this.data.push({
						date: new Date(year, month, day, hour),
						log: []
					});
				}
			}
		}
	}
};

Graph.prototype.dataSet = function(db) {
	var ptr = 0;

	this.dataReset();

	jQuery.each(db, function(i, d) {
		for (; ptr < this.data.length; ptr++) {
			if (d.date.getTime() < this.data[ptr].date.getTime()) {
				this.data[ptr].log.push(d);
				break;
			}
		}
	}.bind(this));

	console.log(this.data);
};

Graph.prototype.update = function(dataset) {
	this.svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return this.xScale(d[0]); }.bind(this))
		.attr("cy", function(d) { return this.yScale(d[1]); }.bind(this))
		.attr("r",  function(d) { return d[2]; }.bind(this))
		.attr("fill",  function(d) { return this.colorScale(d[2]); }.bind(this))
};

Graph.prototype.show = function(idx) {
	// clear graph
	this.svg.selectAll("circle").remove();

	// draw graph
	this.svg.selectAll("circle")
		.data(this.data[idx].log)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return this.xScale(d.lat); }.bind(this))
		.attr("cy", function(d) { return this.yScale(d.lng); }.bind(this))
		.attr("r",  function(d) { return d.level*3; }.bind(this))
		.attr("fill",  function(d) { return this.colorScale(d.level); }.bind(this))
};

Graph.prototype.getDateText = function(idx) {
	var date = this.data[idx].date;
	return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' +
		date.getHours() + ':00';
};

var Apl = function() {
	this.db = [];
};

Apl.prototype.getData = function(callback) {
	this.graph = new Graph();

	$.get('./data/all.cgi', function(data) {
		var d = data.split('\r\n');
		jQuery.each(d, function(i, val) {
			var d = val.split(',');
			// skip if log data is not about earth quake
			if (d[1] != 'QUA') return;
			var t = d[2].split('/');
			// skip if lat, lng info is empty
			if (t[8] == '') return;
			var match_result = t[0].match(/(\d+)[^\d](\d+)[^\d](\d+)[^\d]/);
			var date = {
				year: 2016,
				month: 4,
				day: parseInt(match_result[1]),
				hour: parseInt(match_result[2]),
				munite: parseInt(match_result[3]),
			}
			var data = {
				date: new Date(date.year, date.month, date.day,
							   date.hour, date.munite),
				level: t[1][0],
				lng: t[8].substring(1),
				lat: t[9].substring(1),
			};
			this.db.push(data);
		}.bind(this));
		this.graph.dataSet(this.db);

		// callback at all data imported
		callback();

		// default graph
		this.graph.show(0);
	}.bind(this));
};

Apl.prototype.showDB = function() {
	var html = '<table border="1">';
	jQuery.each(this.db, function(i, d) {
		html += '<tr><td>' + d.date + '</td><td>' + d.level + '</td><td>' +
			d.lng + '</td><td>' + d.lat + '</td></tr>';
	});
	html += '</table>';

	$('#data').append(html);
};

Apl.prototype.showGraph = function(idx) {
	this.graph.show(idx);
};

$(function() {
	var apl = new Apl();
	apl.getData(function() {
		$("#slider").slider({
			value: 0,
			min: 0,
			max: apl.graph.data.length - 1,
			step: 1,
			slide: function(event, ui) {
				this.showGraph(ui.value);
				$("#val").val(this.graph.getDateText(ui.value));
			}.bind(this)
		});
		$("#val").val(this.graph.getDateText(0));
	}.bind(apl));
});
