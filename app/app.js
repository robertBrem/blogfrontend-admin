'use strict';

var myApp = angular.module('myApp', [
    'ngRoute',
    'hljs',
    'myApp.entries',
    'myApp.comments'
]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .otherwise({redirectTo: '/entries'});
}]);

myApp.config(function (hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    });
});

myApp.config(function ($provide) {
    var directives = [
        "alert"
    ];
    for (var i = 0; i < directives.length; i++) {
        $provide.decorator(directives[i] + "Directive", function ($delegate) {
            $delegate[0].templateUrl = "bower_components/angular-ui-bootstrap/" + $delegate[0].templateUrl;
            return $delegate;
        });
    }
});

var auth = {};

var logout = function () {
    console.log('*** LOGOUT');
    auth.loggedIn = false;
    auth.authz = null;
    window.location = auth.logoutUrl;
};

angular.element(document).ready(function () {

    console.log("*** here");
    var keycloakAuth = new Keycloak('keycloak.json');
    auth.loggedIn = false;

    keycloakAuth.init({onLoad: 'login-required'}).success(function () {
        console.log('here login');
        auth.loggedIn = true;
        auth.authz = keycloakAuth;
        auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/" + keycloakAuth.realm + "/tokens/logout?redirect_uri=http://localhost:8000/#/admin";
        myApp.factory('Auth', function () {
            return auth;
        });
        angular.bootstrap(document, ["myApp"]);
    }).error(function () {
        alert("failed to login");
    });

});

myApp.factory('authInterceptor', function ($q, Auth) {
    return {
        request: function (config) {
            var deferred = $q.defer();
            if (Auth.authz.token) {
                Auth.authz.updateToken(5).success(function () {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + Auth.authz.token;

                    deferred.resolve(config);
                }).error(function () {
                    deferred.reject('Failed to refresh token');
                });
            }
            return deferred.promise;
        }
    };
});

myApp.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('errorInterceptor');
    $httpProvider.interceptors.push('authInterceptor');

});

myApp.factory('errorInterceptor', function ($q) {
    return function (promise) {
        return promise.then(function (response) {
            return response;
        }, function (response) {
            if (response.status == 401) {
                console.log('session timeout?');
                logout();
            } else if (response.status == 403) {
                alert("Forbidden");
            } else if (response.status == 404) {
                alert("Not found");
            } else if (response.status) {
                if (response.data && response.data.errorMessage) {
                    alert(response.data.errorMessage);
                } else {
                    alert("An unexpected server error has occurred");
                }
            }
            return $q.reject(response);
        });
    };
});