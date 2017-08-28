angular.module('App', [])
	.service('todos', ['$rootScope', '$filter', function($scope, $filter) {
		var list = [];
		var where = $filter('filter');

		$scope.$watch(function () {
			console.log(list);
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

	.controller('ToolbarController', ['$scope', 'todos', function($scope, todos) {
		$scope.filter = todos.filter

		$scope.$on('change:list', function(e, list) {
			$scope.allCount = list.length;
			$scope.doneCount = todos.getDone().length;
			$scope.remainingCount = $scope.allCount - $scope.doneCount;
		});

		$scope.checkAll = function() {
			todos.changeState(!!$scope.remainingCount);
		};
		
		$scope.changeFilter = function(filter) {
			$scope.$emit('change:filter', filter);
		};

		$scope.removeDoneTodo = function() {
			todos.removeDone();
		};
	}])

	.controller('TodoListController', ['$scope', 'todos', function ($scope, todos) {
		$scope.$on('change:list', function (e, list) {
			$scope.todoList = list;
		});
		
		var originalTitle;
		
		$scope.editing = null;
		
		$scope.editTodo = function (todo) {
			originalTitle = todo.title;
			$scope.editing = todo;
		};
		
		$scope.doneEdit = function (todoForm) {
			if (todoForm.$invalid) {
				$scope.editing.title = originalTitle;
			}
			$scope.editing = originalTitle = null;
		};
		
		$scope.removeTodo = function (todo) {
			todos.remove(todo);
		};
	}])

	.controller('MainController', ['$scope', 'todos', function($scope, todo) {
		$scope.currentFilter = null;
		
		$scope.$on('change:filter', function(e, filter) {
			$scope.currentFilter = filter;
		});
	}])

	.directive('mySelect', [function () {
		return function (scope, $el, attrs) {
			// scope - current scope object
			// $el   - jqLite or jQuery object
			// attrs - hash of DOM attribute
			scope.$watch(attrs.mySelect, function (val) {
				if (val) {
					$el[0].select();
				}
			});
		};
	}]);
