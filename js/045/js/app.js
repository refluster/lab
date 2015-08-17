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
		.when('/show/:file*', {
			templateUrl: 'tmpl-show',
			controller: 'ShowController'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.service('list', ['$rootScope', '$filter', '$http', function($scope, $filter, $http) {
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
		this.list = {};
		$http.get("db.json").success(function(db) {
			// insert db into list
			angular.forEach(db, function(v) {
				if (this.list[v.date] == undefined) {
					this.list[v.date] = [];
				}
				this.list[v.date].push({
					fileOrig: v.fileOrig,
					fileLarge: v.fileLarge,
					fileThumb: v.fileThumb});
			}.bind(this));
		}.bind(this));
	}.bind(this);

	this.get = function() {
		return this.list;
	}.bind(this);
}]);

app.service('serverPolling', ['$rootScope', '$http', function($scope, $http) {
	this.setInterval = function(url, msec, callback) {
		this.timer = setInterval(function() {
			$http.get(url).success(function(status) {
				callback(status);
			}.bind(this));
		}, msec);
		
	}.bind(this);

	this.clearInterval = function() {
		clearInterval(this.timer);
	}.bind(this);
}]);

app.controller('MainController', ['$scope', 'list', function($scope, list) {
	$scope.$on('change:list', function (e, list) {
		$scope.pictureList = list;
	});

	list.load();
}]);

app.controller('ListWideController', ['$scope', 'list', 'serverPolling', function($scope, list, serverPolling) {
	$scope.pictureList = list.get();

	$scope.importImage = function() {
		serverPolling.setInterval('import', 1000, function(status) {
			console.log(status);
			if (status == 'standby') {
				serverPolling.clearInterval();
			}
		});
	};
}]);

app.controller('ListNarrowController', ['$scope', 'list', function($scope, list) {
	$scope.pictureList = list.get();
}]);

app.controller('ShowController', ['$scope', '$routeParams', 'list', function($scope, $params, sheets) {
	$scope.file = $params.file;
}]);

