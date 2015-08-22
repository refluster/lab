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

app.service('sse', ['$rootScope', function($scope) {
	this.connect = function() {
		this.es = new EventSource("/sse");
	};

	this.setCallback = function(callback) {
		this.es.onmessage = function (event) {
			console.log(event.data);
			callback(event.data);
		};
	}.bind(this);
}]);

app.controller('MainController', ['$scope', 'list', 'sse', function($scope, list, sse) {
	$scope.$on('change:list', function (e, list) {
		$scope.pictureList = list;
	});

	list.load();
	sse.connect();
}]);

app.controller('ListWideController', ['$scope', '$http', 'list', 'sse', function($scope, $http, list, sse) {
	$scope.pictureList = list.get();
	sse.setCallback(function(jsonString) {
		var data = angular.fromJson(jsonString);
		$scope.$apply(function () {
			$scope.importing = (data.complete != data.total);
			$scope.progress = data;
        });
		console.log(data);
	});

	$scope.importImage = function() {
		$scope.importing = true;
		$http.get('import').success(function(res) {});
	};
}]);

app.controller('ListNarrowController', ['$scope', 'list', function($scope, list) {
	$scope.pictureList = list.get();
}]);

app.controller('ShowController', ['$scope', '$routeParams', 'list', function($scope, $params, sheets) {
	$scope.file = $params.file;
}]);

