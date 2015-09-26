app = angular.module('App', [])
	.service('system', ['$rootScope', '$filter', function($scope, $filter) {
		var formula = [];
		var where = $filter('filter');

		$scope.$watch(function () {
			return formula;
		}, function (value) {
			$scope.$broadcast('change:system', formula);
		}, true);
		
		this.add = function(f) {
			formula.push(f);
		};
	}])

	.controller('RegisterController', ['$scope', 'system', function($scope, system) {
		$scope.formula = '';

		$scope.addFormula = function() {
			system.add($scope.formula);
			for (var i = 0; i < $scope.formula.length; i++) {
				console.log($scope.formula.charAt(i));
			}
		};
	}])

	.controller('CanvasController', ['$scope', 'system', function($scope, system) {
        $scope.$on('change:system', function(e, formula) {
            console.log("change ===");
            console.log(formula);
		});
	}])

	.controller('MainController', ['$scope', 'system', function($scope, system) {
	}]);
