define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');

	var ImageSurface = require("famous/surfaces/ImageSurface");
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');

    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    function initApp() {
//        var appView = new AppView();

//        mainContext.add(appView);



		// your app here
		var logo = new ImageSurface({
			size: [300, 100],
			content: 'img/scheme-mono.png',
			classes: ['double-sided']
		});

		var initialTime = Date.now();
		var centerSpinModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			transform : function () {
				return Transform.rotateY(.002 * (Date.now() - initialTime));
				//return Transform.rotateZ(.002 * (Date.now() - initialTime));
			}
		});

		mainContext.add(centerSpinModifier).add(logo);
    }

	initApp();
});
