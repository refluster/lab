window.onload = function() {
	setTimeout(function() {
		$("#obj").addClass("visible");
	}, 1000);
	
	$("#obj").click(function(e) {
		console.log("clicked");
	});

	$(".circle").click(function(e) {
		console.log("hoge");
		$(this).addClass("scale");
	});
	
	function setPosition(elem, x, y) {
		var w = elem.width();
		var h = elem.height();
		elem.css("-webkit-transform", "translate(" + (x - w/2) + "px, " + (y - h/2) + "px)");
		elem.css("transform", "translate(" + (x - w/2) + "px, " + (y - h/2) + "px)");
	}

	$(".button1").each(function() {
		setPosition($(this), 100, 300);
	});

	$(".button2").each(function() {
		setPosition($(this), 200, 300);
	});

	////////////////////////////// graph //////////////////////////////

	// Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	// This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);

	Chart.defaults.global = {
		// Boolean - Whether to animate the chart
		animation: false,

		// Number - Number of animation steps
		animationSteps: 20,

		// String - Animation easing effect
		// Possible effects are:
		// [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
		//  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
		//  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
		//  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
		//  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
		//  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
		//  easeOutElastic, easeInCubic]
		animationEasing: "easeOutQuart",

		// Boolean - If we should show the scale at all
		showScale: true,

		// Boolean - If we want to override with a hard coded scale
		scaleOverride: false,

		// ** Required if scaleOverride is true **
		// Number - The number of steps in a hard coded scale
		scaleSteps: null,
		// Number - The value jump in the hard coded scale
		scaleStepWidth: null,
		// Number - The scale starting value
		scaleStartValue: null,

		// String - Colour of the scale line
		scaleLineColor: "rgba(0,0,0,.1)",

		// Number - Pixel width of the scale line
		scaleLineWidth: 1,

		// Boolean - Whether to show labels on the scale
		scaleShowLabels: true,

		// Interpolated JS string - can access value
		scaleLabel: "<%=value%>",

		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleIntegersOnly: true,

		// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero: false,

		// String - Scale label font declaration for the scale label
		scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		// Number - Scale label font size in pixels
		scaleFontSize: 12,

		// String - Scale label font weight style
		scaleFontStyle: "normal",

		// String - Scale label font colour
		scaleFontColor: "#666",

		// Boolean - whether or not the chart should be responsive and resize when the browser does.
		responsive: false,

		// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
		maintainAspectRatio: true,

		// Boolean - Determines whether to draw tooltips on the canvas or not
		showTooltips: true,

		// Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
		customTooltips: false,

		// Array - Array of string names to attach tooltip events
		tooltipEvents: ["mousemove", "touchstart", "touchmove"],

		// String - Tooltip background colour
		tooltipFillColor: "rgba(0,0,0,0.8)",

		// String - Tooltip label font declaration for the scale label
		tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		// Number - Tooltip label font size in pixels
		tooltipFontSize: 14,

		// String - Tooltip font weight style
		tooltipFontStyle: "normal",

		// String - Tooltip label font colour
		tooltipFontColor: "#fff",

		// String - Tooltip title font declaration for the scale label
		tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		// Number - Tooltip title font size in pixels
		tooltipTitleFontSize: 14,

		// String - Tooltip title font weight style
		tooltipTitleFontStyle: "bold",

		// String - Tooltip title font colour
		tooltipTitleFontColor: "#fff",

		// Number - pixel width of padding around tooltip text
		tooltipYPadding: 6,

		// Number - pixel width of padding around tooltip text
		tooltipXPadding: 6,

		// Number - Size of the caret on the tooltip
		tooltipCaretSize: 8,

		// Number - Pixel radius of the tooltip border
		tooltipCornerRadius: 6,

		// Number - Pixel offset from point x to tooltip edge
		tooltipXOffset: 10,

		// String - Template string for single tooltips
		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

		// String - Template string for multiple tooltips
		multiTooltipTemplate: "<%= value %>",

		// Function - Will fire on animation progression.
		onAnimationProgress: function(){},

		// Function - Will fire on animation completion.
		onAnimationComplete: function(){}
	}

	Chart.defaults.global.responsive = true;

	var data = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: [65, 59, 80, 81, 56, 55, 40]
			},
			{
				label: "My Second dataset",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: [28, 48, 40, 19, 86, 27, 90]
			}
		]
	};
	
	//var myLineChart = new Chart(ctx).Line(data, options);
	var myLineChart = new Chart(ctx).Line(data, null);
};

