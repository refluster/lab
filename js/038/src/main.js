define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');

    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    function initApp() {
        var appView = new AppView();

        mainContext.add(appView);
    }

	initApp();
});
