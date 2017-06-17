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

		var endpoint = "";
		var appKey = "";
		var channel = "myTodoChannel";

		var rtm = new RTM(endpoint, appKey);
		rtm.on("enter-connected", function() {
			$log.info("Connected to RTM.");
  		});

		rtm.start();

		var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE, {history: {age: 10*60}});

		subscription.on('rtm/subscription/data', function (pdu) {
  			pdu.body.messages.forEach(function (msg) {
  			if      (msg.command==="insert")	items[msg.item.id] = msg.item;
			else if (msg.command==="remove")	delete items[msg.item.id];
			else if (msg.command==="update")	items[msg.item.id] = msg.item;
			$scope.$apply();
  			});
		});		

		// Handle methods
		$scope.addTodo = function () {
			if (!$scope.newTodo.trim()) return; // No content
			var todo = {
				id: Math.floor(Math.random() * 100000),
				title: $scope.newTodo.trim(),
				completed: false
			};
			$scope.newTodo = '';

			rtm.publish(channel, {command: "insert", item: todo});
		};

		$scope.removeTodo = function (todo) {
			rtm.publish(channel, {command: "remove", item: todo});
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed))
				todo.completed = completed;
			rtm.publish(channel, {command: "update", item: todo});
		};

	});
