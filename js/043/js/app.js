angular.module('App', [])
	.controller('MainController', ['$scope', function ($scope) {

		$scope.todos = [];

		$scope.addTodo = function () {
			console.log('hoge');
			$scope.todos.push({
				title: Math.random(),
				done: false
			});
		};
		
	}]);


