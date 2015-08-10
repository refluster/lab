angular.module('App', [])
	.controller('MainController', ['$scope', function ($scope) {

		$scope.todos = [];
		$scope.newTitle = '';

		$scope.filter = {
			done: {done: true},
			remaining: {done: false}};
		$scope.currentFilter = null;

		$scope.addTodo = function () {
			$scope.todos.push({
				title: $scope.newTitle,
				done: false
			});
			$scope.newTitle = '';
		};
		
		$scope.changeFilter = function(filter) {
			$scope.currentFilter = filter;
		};
	}]);


