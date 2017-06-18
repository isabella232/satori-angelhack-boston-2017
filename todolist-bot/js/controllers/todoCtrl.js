/*global angular */

/**
 * The main controller for the app. The controller:
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
    .controller('TodoCtrl', function TodoCtrl($scope, $log) {
        'use strict';

        // Initialize storage
        var items = $scope.todos = {};
        $scope.newTodo = '';

        var endpoint = "wss://iw4unpv5.api.satori.com";
        var appKey = "17c86dcFf0c4eD4EDE3b0972Ad7AAB1a";

        var sendChannel = "myTodoChannel";
        var stateKey = "myTodoState";


        var rtm = new RTM(endpoint, appKey);
        rtm.on("enter-connected", function () {
            $log.info("Connected to RTM.");

            // Retrieve the state from the channel if exists
            rtm.read(stateKey, function (pdu) {
                var state = pdu.body.message;
                if (state != null) {
                    $scope.todos = state.items;
                    $scope.$apply();
                    subscribe(rtm, state.nextUpdate);
                } else {
                    subscribe(rtm, null);
                }
            });
        });

        rtm.start();


        // Handle methods
        $scope.addTodo = function () {
            if (!$scope.newTodo.trim()) return; // No content
            var todo = {
                id: Math.floor(Math.random() * 100000),
                title: $scope.newTodo.trim(),
                completed: false
            };
            $scope.newTodo = '';

            rtm.publish(sendChannel, {command: "insert", item: todo});
        };

        $scope.removeTodo = function (todo) {
            rtm.publish(sendChannel, {command: "remove", item: todo});
        };

        $scope.toggleCompleted = function (todo, completed) {
            if (angular.isDefined(completed))
                todo.completed = completed;
            rtm.publish(sendChannel, {command: "update", item: todo});
        };


        function subscribe(rtm, position) {

            // If state existed, subscribe to the message channel from the
            // position indicated there. If not, subscribe from the current
            // position.
            var bodyOpts = (position == null) ? {} : {next: position};
            var subscription = rtm.subscribe(sendChannel, RTM.SubscriptionMode.SIMPLE, bodyOpts);

            subscription.on('rtm/subscription/data', function (pdu) {
                pdu.body.messages.forEach(function (msg) {
                    if (msg.command === "insert") $scope.todos[msg.item.id] = msg.item;
                    else if (msg.command === "remove") delete $scope.todos[msg.item.id];
                    else if (msg.command === "update") $scope.todos[msg.item.id] = msg.item;
                    $scope.$apply();
                });
            });
        }

    });
