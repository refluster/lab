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
		isValid = true;

		for (var i = 0; i < f.length; i++) {
			var c = f.charAt(i);

			if (c == '+' || c == '-') {
			} else if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z') {
				if (formula[c] == undefined) {
					formula[c] = '';
				}
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
		var f = formula['.'];

		for (var i = 0; i < 3; i++) {
			f = f.replace(/F/g, formula.F);
		}

		this.clear();

		this.context = [];
		this.context.push({x: this.canvasWidth/2,
						   y: this.canvasHeight*.8,
						   angle: -Math.PI/2});

		var c = this.context[this.context.length - 1];

		this.ctx.beginPath();
		this.ctx.moveTo(c.x, c.y);

		for (var i = 0; i < f.length; i++) {
			switch (f.charAt(i)) {
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
			case '[':
				this.pushContext();
				break;
			case ']':
				this.popContext();
				break;
			}
		}

		this.ctx.stroke();
	};

	this.moveFowardLine = function() {
		var c = this.context[this.context.length - 1];

		c.x += this.distance * Math.cos(c.angle);
		c.y += this.distance * Math.sin(c.angle);
		this.ctx.lineTo(c.x, c.y);
	};
	this.moveFoward = function() {
		var c = this.context[this.context.length - 1];

		c.x += this.distance * Math.cos(c.angle);
		c.y += this.distance * Math.sin(c.angle);
		this.ctx.moveTo(c.x, c.y);
	};
	this.turnRight = function() {
		var c = this.context[this.context.length - 1];

		c.angle -= this.angle;
	};
	this.turnLeft = function() {
		var c = this.context[this.context.length - 1];

		c.angle += this.angle;
	};

	this.clear = function() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	};
}]);

app.controller('RegisterController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	$scope.editingVar = null;

    $scope.$on('change:system', function(e, formula) {
		console.log(formula);

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
