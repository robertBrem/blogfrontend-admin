'use strict';

var entriesApp = angular.module('myApp.entries', ['ngRoute', 'ui.bootstrap.alert', 'ngSanitize', 'configuration']);

entriesApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/entries/:id', {
        templateUrl: 'views/entries/entries.html',
        controller: 'EntriesCtrl'
    }).when('/entries', {
        templateUrl: 'views/entries/entries.html',
        controller: 'EntriesCtrl'
    });
}]);

entriesApp.controller('EntriesCtrl', function ($scope, $http, $routeParams, $location, ENTRY_URL) {

    $scope.alerts = [];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $http.get(ENTRY_URL).then(function (response) {
        $scope.entries = response.data;
    });

    if ($routeParams.id) {
        $http.get(ENTRY_URL + $routeParams.id).
            success(function (data) {
                $scope.current = data;
            }).
            error(function (data, status, headers, config) {
                // error
            });
    } else {
        $scope.current = {};
        $scope.current.creationDate = new Date();
    }

    $scope.toHTML = function (content) {
        if (!content) {
            return '';
        }
        return content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };

    $scope.addKeyword = function (text) {
        $scope.current.keywords.push(text);
    };

    $scope.create = function (entry) {
        entry.content = $scope.toHTML(entry.content);
        entry.creationDate = undefined;

        $http.post(ENTRY_URL,
            entry)
            .then(function (response) {
                $scope.created = response.data;
                $scope.alerts.push({type: 'success', msg: 'Juhuuu! ' + entry.title + ' wurde erfolgreich erstellt.'});
            });
    };

    $scope.update = function (entry) {
        entry.content = $scope.toHTML(entry.content);

        $http.post(ENTRY_URL + $routeParams.id,
            entry)
            .then(function (response) {
                $scope.created = response.data;
                $scope.alerts.push({
                    type: 'success',
                    msg: 'Juhuuu! ' + entry.title + ' wurde erfolgreich aktualisiert.'
                });
            });
    };

    $scope.delete = function (id) {
        $http.delete(ENTRY_URL + id)
            .then(function (response) {
                $scope.created = response.data;
                $scope.alerts.push({
                    type: 'success',
                    msg: 'Juhuuu! ' + $scope.current.title + ' wurde erfolgreich gelöscht.'
                });
            });
    };

    $scope.clear = function () {
        $location.path('/entries');
        $scope.current = {};
        $scope.current.creationDate = new Date();
    };
});
