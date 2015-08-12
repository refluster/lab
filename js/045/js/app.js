app = angular.module('App', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'tmpl-list-wide'
		})
		.when('/list-narrow', {
			templateUrl: 'tmpl-list-narrow'
		})
		.when('/show/:id', {
			templateUrl: 'tmpl-show'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
