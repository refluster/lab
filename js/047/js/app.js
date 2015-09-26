angular.module('App', [])
	.service('todos', ['$rootScope', '$filter', function($scope, $filter) {
		var list = [];
		var where = $filter('filter');

		$scope.$watch(function () {
			return list;
		}, function (value) {
			$scope.$broadcast('change:list', value);
		}, true);
		
		var done = {done: true};
		var remaining = {done: false};

		this.filter = {
			done: done,
			remaining: remaining
		};

		this.getDone = function() {
			return where(list, done);
		};

		this.getRemaining = function() {
			return where(list, remaining);
		};

		this.add = function(title) {
			list.push({
				title: title,
				done: false
			});
		};

		this.remove = function(_todo) {
			list = where(list, function(todo) {
				return todo !== _todo;
			});
		};

		this.removeDone = function() {
			list = where(list, remaining);
		};

		this.changeState = function(state) {
			angular.forEach(list, function(todo) {
				todo.done = state;
			});
		};
	}])

	.controller('RegisterController', ['$scope', 'todos', function($scope, todos) {
		$scope.newTitle = '';

		$scope.addTodo = function() {
			todos.add($scope.newTitle);
			$scope.newTitle = '';
		};
	}])

	.controller('MainController', ['$scope', 'todos', function($scope, todo) {
		$scope.currentFilter = null;
		
		$scope.$on('change:filter', function(e, filter) {
			$scope.currentFilter = filter;
		});
	}]);
