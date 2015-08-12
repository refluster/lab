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
		.when('/show/:id', {
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
	
	this.load = function() {
		this.list = [{
			date: '2015/08/12',
			file: [
				['build000.jpg','build000-80.jpg'],
				['build001.jpg','build001-80.jpg'],
				['build002.jpg','build002-80.jpg'],
				['build003.jpg','build003-80.jpg'],
				['build004.jpg','build004-80.jpg'],
				['build005.jpg','build005-80.jpg'],
				['build006.jpg','build006-80.jpg']
			]}];
	};

	this.get = function() {
		return this.list;
	};
}]);

app.controller('ListWideController', ['$scope', 'list', function($scope, list) {
/*
    $scope.$on('change:list', function (e, list) {
		$scope.pictureList = list;
    });
*/

	list.load();
	$scope.pictureList = list.get();
}]);

app.controller('ListNarrowController', [function() {
}]);

app.controller('ShowController', [function() {
}]);
