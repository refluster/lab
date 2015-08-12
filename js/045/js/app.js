app = angular.module('App', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'tmpl-list-wide',
			controller: 'ListWideController'
		})
		.when('/list-narrow', {
			templateUrl: 'tmpl-list-narrow',
			controller: 'ListNarrowController'
		})
		.when('/show/:file', {
			templateUrl: 'tmpl-show',
			controller: 'ShowController'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.service('list', ['$rootScope', '$filter', function($scope, $filter) {
	this.list = [];

    $scope.$watch(function () {
        return this.list;
    }.bind(this), function (value) {
        $scope.$broadcast('change:list', value);
    }.bind(this), true);
	
	function pad(n, len) {
		s = n.toString();
		if (s.length < len) {
			s = ('0000000000' + s).slice(-len);
		}
		return s;
	}
	
	this.load = function() {
		this.list = [{
			date: '2015/08/12',
			file: []
		}, {
			date: '2015/08/13',
			file: []
		}];

		for (var i = 0; i <= 6; i++) {
			this.list[0].file.push(['build' + pad(i, 3) + '.jpg', 'build' + pad(i, 3) + '-80.jpg']);
		}
		for (var i = 0; i <= 10; i++) {
			this.list[1].file.push(['drink' + pad(i, 3) + '.jpg', 'drink' + pad(i, 3) + '-80.jpg']);
		}
		for (var i = 0; i <= 15; i++) {
			this.list[1].file.push(['park' + pad(i, 3) + '.jpg', 'park' + pad(i, 3) + '-80.jpg']);
		}
	}.bind(this);

	this.get = function() {
		return this.list;
	}.bind(this);
}]);

app.controller('MainController', ['$scope', 'list', function($scope, list) {
	list.load();
}]);

app.controller('ListWideController', ['$scope', 'list', function($scope, list) {
/*
    $scope.$on('change:list', function (e, list) {
		$scope.pictureList = list;
    });
*/

	$scope.pictureList = list.get();
}]);

app.controller('ListNarrowController', ['$scope', 'list', function($scope, list) {
	$scope.pictureList = list.get();
}]);

app.controller('ShowController', ['$scope', '$routeParams', 'list', function($scope, $params, sheets) {
	$scope.file = $params.file;
	
}]);
