app = angular.module('App', []);

app.service('system', ['$rootScope', function($scope) {
	var formula = [];

	$scope.$watch(function () {
		return formula;
	}, function (value) {
		$scope.$broadcast('change:system', formula);
	}, true);
	
	this.add = function(f) {
		formula.push(f);
	};
}]);

app.service('canvas', ['$rootScope', function($scope) {
	this.setCanvas = function(canvas) {
		if ( ! canvas || ! canvas.getContext ) {
			return false;
		}

		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		this.ctx = canvas.getContext("2d");

		this.clear();

		this.ctx.fillStyle = '#FF5722';
		this.ctx.beginPath();
		this.ctx.arc(30, 40, 40, 0, Math.PI*2, false);
		this.ctx.fill();
	};

	this.clear = function() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	};
}]);

app.controller('RegisterController', ['$scope', 'system', function($scope, system) {
	$scope.formula = '';

	$scope.addFormula = function() {
		system.add($scope.formula);
		for (var i = 0; i < $scope.formula.length; i++) {
			console.log($scope.formula.charAt(i));
		}
	};
}]);

app.controller('CanvasController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	canvas.setCanvas(document.getElementById("canvas"));
	console.log(this);
    $scope.$on('change:system', function(e, formula) {
        console.log("change ===");
        console.log(formula);
	});
}]);

app.controller('MainController', ['$scope', 'system', function($scope, system) {
}]);
