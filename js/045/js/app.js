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
				['build006.jpg','build006-80.jpg'],
			]}, {
			date: '2015/08/13',
			file: [
				['drink000.jpg','drink000-80.jpg'],
				['drink001.jpg','drink001-80.jpg'],
				['drink002.jpg','drink002-80.jpg'],
				['drink003.jpg','drink003-80.jpg'],
				['drink004.jpg','drink004-80.jpg'],
				['drink005.jpg','drink005-80.jpg'],
				['drink006.jpg','drink006-80.jpg'],
				['drink007.jpg','drink007-80.jpg'],
				['drink008.jpg','drink008-80.jpg'],
				['drink009.jpg','drink009-80.jpg'],
				['drink010.jpg','drink010-80.jpg'],
				['park000.jpg','park000-80.jpg'],
				['park001.jpg','park001-80.jpg'],
				['park002.jpg','park002-80.jpg'],
				['park003.jpg','park003-80.jpg'],
				['park004.jpg','park004-80.jpg'],
				['park005.jpg','park005-80.jpg'],
				['park006.jpg','park006-80.jpg'],
				['park007.jpg','park007-80.jpg'],
				['park008.jpg','park008-80.jpg'],
				['park009.jpg','park009-80.jpg'],
				['park010.jpg','park010-80.jpg'],
				['park011.jpg','park011-80.jpg'],
				['park012.jpg','park012-80.jpg'],
				['park013.jpg','park013-80.jpg'],
				['park014.jpg','park014-80.jpg'],
				['park015.jpg','park015-80.jpg'],
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
