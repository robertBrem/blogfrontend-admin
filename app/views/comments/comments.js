'use strict';

var entriesApp = angular.module('myApp.comments', ['ngRoute', 'ui.bootstrap.alert', 'ngSanitize', 'configuration']);

entriesApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/comments/:commentUrlTitle', {
        templateUrl: 'views/comments/comments.html',
        controller: 'CommentsCtrl'
    }).when('/comments', {
        templateUrl: 'views/comments/comments.html',
        controller: 'CommentsCtrl'
    }).when('/entries/:entryUrlTitle/comments', {
        templateUrl: 'views/comments/comments.html',
        controller: 'CommentsCtrl'
    }).when('/entries/:entryUrlTitle/comments/:commentUrlTitle', {
        templateUrl: 'views/comments/comments.html',
        controller: 'CommentsCtrl'
    });
}]);

entriesApp.controller('CommentsCtrl', function ($scope, $http, $routeParams, $location, ENTRY_URL, COMMENT_URL) {

    $scope.alerts = [];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $http.get(ENTRY_URL).then(function (response) {
        $scope.entries = response.data;
    });

    if ($routeParams.commentUrlTitle) {
        $http.get(COMMENT_URL + $routeParams.commentUrlTitle).
            success(function (data) {
                $scope.current = data;
            }).
            error(function (data, status, headers, config) {
                // error
            });
    } else {
        $scope.current = {};
    }

    if ($routeParams.entryUrlTitle) {
        $http.get(ENTRY_URL + $routeParams.entryUrlTitle).
            success(function (data) {
                $scope.currentEntry = data;
            }).
            error(function (data, status, headers, config) {
                // error
            });
    } else {
        $scope.currentEntry = {};
    }

    $scope.update = function (comment) {
        $http.post(COMMENT_URL + comment.id, comment)
            .then(function (response) {
                $scope.created = response.data;
                $scope.alerts.push({
                    type: 'success',
                    msg: 'Juhuuu! Der Kommentar von ' + comment.author + ' wurde erfolgreich aktualisiert.'
                });
            });
    };

    $scope.delete = function (id) {
        $http.delete(COMMENT_URL + id)
            .then(function (response) {
                $scope.created = response.data;
                $scope.alerts.push({
                    type: 'success',
                    msg: 'Juhuuu! Der Kommentar von ' + $scope.current.author + ' wurde erfolgreich gelöscht.'
                });
            });
    };

    $scope.clear = function () {
        $location.path('/comments');
        $scope.current = {};
    };
});
