app = angular.module('App', []);

app.service('system', ['$rootScope', function($scope) {
	const re = /^[\+\-Ff]*$/;
	var formula = {'.': ''};
	var isValid = true;

	$scope.$watch(function () {
		return formula;
	}, function (value) {
		$scope.$broadcast('change:system', formula);
	}, true);
	
	this.update = function(v, f) {
		if (re.exec(f) == null) {
			isValid = false;
			return;
		}
		formula[v] = f;

		for (var i = 0; i < f.length; i++) {
			var c = f.charAt(i);

			if (c == '+' || c == '-') {
			} else if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z') {
				formula[c] = '';
			}
		}

	};

	this.valid = function() {
		return isValid;
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

		this.distance = 30;
		this.angle = Math.PI/2;

		this.clear();
	};

	this.update = function(formula) {
		this.context = {};
		this.context.x = this.canvasWidth/2;
		this.context.y = this.canvasHeight*.8;
		this.context.angle = -Math.PI/2;

		this.ctx.beginPath();
		this.ctx.moveTo(this.context.x, this.context.y);

		for (var i = 0; i < formula.length; i++) {
			switch (formula.charAt(i)) {
			case 'F':
				this.moveFowardLine();
				break;
			case 'f':
				this.moveFoward();
				break;
			case '+':
				this.turnRight();
				break;
			case '-':
				this.turnLeft();
				break;
			}
		}

		this.ctx.stroke();
	};

	this.moveFowardLine = function() {
		this.context.x += this.distance * Math.cos(this.context.angle);
		this.context.y += this.distance * Math.sin(this.context.angle);
		this.ctx.lineTo(this.context.x, this.context.y);
	};
	this.moveFoward = function() {
		this.context.x += this.distance * Math.cos(this.context.angle);
		this.context.y += this.distance * Math.sin(this.context.angle);
		this.ctx.moveTo(this.context.x, this.context.y);
	};
	this.turnRight = function() {
		this.context.angle -= this.angle;
	};
	this.turnLeft = function() {
		this.context.angle += this.angle;
	};

	this.clear = function() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	};
}]);

app.controller('RegisterController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	$scope.editingVar = null;

    $scope.$on('change:system', function(e, formula) {
		$scope.formula = formula;
	});

	$scope.setFormula = function(v, f) {
		console.log({v: v, f: f});
		system.update(v, f);
	};
}]);

app.controller('CanvasController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	canvas.setCanvas(document.getElementById("canvas"));

    $scope.$on('change:system', function(e, formula) {
		if (system.valid() == true) {
			canvas.update(formula);
		}
	});
}]);

app.controller('MainController', ['$scope', 'system', function($scope, system) {
}]);
