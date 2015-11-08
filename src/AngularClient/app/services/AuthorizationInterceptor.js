(function () {
    'use strict';

    var module = angular.module('mainApp');

    function AuthorizationInterceptor($rootScope, $q) {

        console.log("AuthorizationInterceptor created");

        var request = function (requestSuccess) {
            requestSuccess.headers = requestSuccess.headers || {};

            if ($rootScope.authorizationData) {
                requestSuccess.headers.Authorization = 'Bearer ' + $rootScope.authorizationData;
            }

            return requestSuccess || $q.when(requestSuccess);
        };

        var responseError = function(responseFailure) {

            console.log("console.log(responseFailure);");
            console.log(responseFailure);
            if (responseFailure.status === 403) {
                $rootScope.authorizationData = null;

            } else if (responseFailure.status === 401) {

                $rootScope.authorizationData = null;
            }

            return this.q.reject(responseFailure);
        };

        return {
            request: request,
            responseError: responseError
        }
    }

    module.service("authorizationInterceptor", [
            '$rootScope',
            '$q',
            AuthorizationInterceptor
    ]);

    module.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("authorizationInterceptor");
    }]);

})();
