var Graph = function() {
	this.svg = d3.select("#contents")
		.append("svg")
		.attr("width", 500)
		.attr("height", 300);
	this.dataReset();
};

Graph.prototype.dataReset = function() {
	this.data = [];
};

Graph.prototype.dataSet = function(lng, lat, level) {
	this.data.push(lng, lat, level);
};

Graph.prototype.update = function(dataset) {
	this.svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return d[0]; })
		.attr("cy", function(d) { return d[1]; })
		.attr("r",  function(d) { return d[2]; })
		.fill("fill", "green");
};

var Apl = function() {
	this.db = [];
};

Apl.prototype.getData = function() {
	this.graph = new Graph();

	$.get('./data.dat', function(data) {
		var d = data.split('\r\n');
		jQuery.each(d, function(i, val) {
			var d = val.split(',');
			if (d[1] != 'QUA')
				return;
			var t = d[2].split('/');
			var match_result = t[0].match(/(\d+)[^\d](\d+)[^\d](\d+)[^\d]/);
//			console.log(t[0]);
			var date = {
				year: 2016,
				month: 4,
				day: parseInt(match_result[1]),
				hour: parseInt(match_result[2]),
				munite: parseInt(match_result[3]),
			}
//			console.log(date);
			var data = {
				date: new Date(date.year, date.month, date.day,
							   date.hour, date.munite),
				level: t[1][0],
				lng: t[8].substring(1),
				lat: t[9].substring(1),
			};
			this.db.push(data);
//			console.log(data.date);
		}.bind(this));
		this.showDB();
	}.bind(this));
};

Apl.prototype.showDB = function() {
	return;

	var html = '<table border="1">';
	jQuery.each(this.db, function(i, d) {
		html += '<tr><td>' + d.date + '</td><td>' + d.level + '</td><td>' +
			d.lng + '</td><td>' + d.lat + '</td></tr>';
	});
	html += '</table>';

	$('#data').append(html);
};

Apl.prototype.showGraph = function() {
	var dataset = [
        [   5,   20 ,  3],
        [ 480,   90 ,  4],
        [ 250,   50 ,  5],
        [ 100,   33 , 10],
        [ 330,   95 , 12],
        [ 410,   12 ,  5],
        [ 475,   44 ,  1],
        [  25,   67 ,  8],
        [  85,   21 ,  5],
        [ 220,   88 ,  6]
    ];

	this.graph.update(dataset);
};

$(function() {
	var apl = new Apl();
	apl.getData();
	apl.showGraph();
});
