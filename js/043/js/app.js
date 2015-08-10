angular.module('App', [])
	.controller('MainController', ['$scope', '$filter', function ($scope, $filter) {
		var where = $filter('filter');

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

		$scope.$watch('todos', function(todos) {
			$scope.allCount = todos.length;
			$scope.doneCount = where(todos, $scope.filter.done).length;
			$scope.remainingCount = $scope.allCount - $scope.doneCount;
		}, true);


		var originalTitle;     // todo contents before editing
		$scope.editing = null; // todo model on editing mode
		
		$scope.editTodo = function(todo) {
			originalTitle = todo.title;
			$scope.editing = todo;
		};

		$scope.doneEdit = function(todoForm) {
			if (todoForm.$invalid) {
				$scope.editing.title = originalTitle;
			}
			$scope.editing = originalTitle = null;
		};

		$scope.checkAll = function() {
			var state = !!$scope.remaininigCount;
			
			angular.forEach($scope.todos, function(todo) {
				todo.done = state;
			});
		};

		$scope.removeDoneTodo = function() {
			$scope.todos = where($scope.todos, $scope.filter.remaining);
		};

		$scope.removeTodo = function(currentTodo) {
			$scope.todos = where($scope.todos, function(todo) {
				return todo != currentTodo;
			});
		};
	}])

	.directive('mySelect', [function () {
		return function (scope, $el, attrs) {
			// scope - 現在の $scope オブジェクト
			// $el   - jqLite オブジェクト(jQuery ライクオブジェクト)
			//         jQuery 使用時なら jQuery オブジェクト
			// attrs - DOM 属性のハッシュ(属性名は正規化されている)
			
			scope.$watch(attrs.mySelect, function (val) {
				if (val) {
					$el[0].select();
				}
			});
		};
	}]);
