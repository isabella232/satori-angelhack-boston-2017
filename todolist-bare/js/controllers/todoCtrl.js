/*global angular */

/**
 * The main controller for the app. The controller:
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $log) {
		'use strict';

		// Initialize storage
		var items = $scope.todos = {}
		$scope.newTodo = '';		

		// Handle methods
		$scope.addTodo = function () {
			if (!$scope.newTodo.trim()) return; // No content
			var todo = {
				id: Math.floor(Math.random() * 100000),
				title: $scope.newTodo.trim(),
				completed: false
			};
			$scope.newTodo = '';

			items[todo.id] = todo;
		};

		$scope.removeTodo = function (todo) {
			delete items[todo.id];
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed))
				todo.completed = completed;
			items[todo.id] = todo;
		};

	});
