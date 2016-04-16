var Apl = function() {
	this.db = [];
	this.svg = d3.select("#contents")
		.append("svg")
		.attr("width", 500)
		.attr("height", 100);
};

Apl.prototype.getData = function() {
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

Apl.prototype.graph = function(dataset) {
	this.svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return d[0]; })
		.attr("cy", function(d) { return d[1]; })
		.attr("r", 5)
		.fill("fill", "green");
};

$(function() {
	var dataset = [
        [   5,   20 ],
        [ 480,   90 ],
        [ 250,   50 ],
        [ 100,   33 ],
        [ 330,   95 ],
        [ 410,   12 ],
        [ 475,   44 ],
        [  25,   67 ],
        [  85,   21 ],
        [ 220,   88 ]
    ];

	var apl = new Apl();
	apl.getData();
	apl.graph(dataset);
});
