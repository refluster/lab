app = angular.module('App', []);

app.service('system', ['$rootScope', function($scope) {
	const re = /^[\+\-\[\]A-Zf]*$/;
	var formula = {'.': ''};
	var isValid = true;
	var param = {length: 8, angle: 90, n: 3};

	$scope.$watch(function () {
		return param;
	}, function (value) {
		$scope.$broadcast('change:system', param, formula);
	}, true);

	$scope.$watch(function () {
		return formula;
	}, function (value) {
		$scope.$broadcast('change:system', param, formula);
	}, true);

	this.updateParam = function(k, v) {
		param[k] = v;
	};

	this.update = function(v, f) {
		if (re.exec(f) == null) {
			isValid = false;
			return;
		}
		formula[v] = f;
		isValid = true;

		for (var i = 0; i < f.length; i++) {
			var c = f.charAt(i);

			if (c == '+' || c == '-' || c == '[' || c == ']') {
			} else if (c >= 'A' && c <= 'Z' || c == 'f') {
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

		this.clear();
	};

	this.update = function(param, formula) {
		this.length = param.length;
		this.angle = param.angle/180*Math.PI;
		this.recursive = param.n;

		var f = formula['.'];

		for (var i = 0; i < this.recursive; i++) {
			angular.forEach(formula, function(_f, _v) {
				if (_v == '.') {
					return;
				}
				var re = new RegExp(_v, 'g');
				f = f.replace(re, _f);
			});
		}

		this.context = [];
		this.context.push({x: this.canvasWidth/2,
						   y: this.canvasHeight*.8,
						   angle: -Math.PI/2});

		var c = this.context[this.context.length - 1];

		this.clear();
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

		this.ctx.moveTo(c.x, c.y);
		c.x += this.length * Math.cos(c.angle);
		c.y += this.length * Math.sin(c.angle);
		this.ctx.lineTo(c.x, c.y);
	};
	this.moveFoward = function() {
		var c = this.context[this.context.length - 1];

		c.x += this.length * Math.cos(c.angle);
		c.y += this.length * Math.sin(c.angle);
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
	this.pushContext = function() {
		var c = this.context[this.context.length - 1];

		this.context.push({x: c.x, y: c.y, angle: c.angle});
	};
	this.popContext = function() {
		this.context.pop();
	};

	this.clear = function() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	};
}]);

app.controller('RegisterController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	$scope.editingVar = null;

    $scope.$on('change:system', function(e, param, formula) {
		console.log(param);
		console.log(formula);

		$scope.param = param;
		$scope.formula = formula;
	});

	$scope.setParam = function(k, v) {
		console.log({k: k, v: v});
		system.updateParam(k, v);
	};

	$scope.setFormula = function(v, f) {
		console.log({v: v, f: f});
		system.update(v, f);
	};
}]);

app.controller('CanvasController', ['$scope', 'system', 'canvas', function($scope, system, canvas) {
	canvas.setCanvas(document.getElementById("canvas"));

    $scope.$on('change:system', function(e, param, formula) {
		if (system.valid() == true) {
			canvas.update(param, formula);
		}
	});
}]);

app.controller('MainController', ['$scope', 'system', function($scope, system) {
}]);
