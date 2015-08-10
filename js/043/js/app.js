angular.module('App', [])
	.controller('MainController', ['$scope', '$filter', function ($scope, $filter) {

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

		$scope.$watch('todos', function (todos) {
			// todos が増減したり各要素のプロパティが変更された時に実行される
		}, true);


		var where = $filter('filter');
		$scope.$watch('todos', function(todos) {
			$scope.allCount = todos.length;
			$scope.doneCount = where(todos, $scope.filter.done).length;
			$scope.remainingCount = $scope.allCount - $scope.doneCount;
		}, true);

	}]);


