(function () {
    'use strict';

    var module = angular.module('mainApp');

    function AuthorizationInterceptor($q, localStorageService) {

        console.log("AuthorizationInterceptor created");

        var request = function (requestSuccess) {
            requestSuccess.headers = requestSuccess.headers || {};

            //localStorageService.set("authorizationData", "");
            //localStorageService.get("authorizationData");
            //localStorageService.set("authStateControl", "");
            //localStorageService.get("authStateControl");
            if (localStorageService.get("authorizationData") !== "") {
                requestSuccess.headers.Authorization = 'Bearer ' + localStorageService.get("authorizationData");
            }

            return requestSuccess || $q.when(requestSuccess);
        };

        var responseError = function(responseFailure) {

            console.log("console.log(responseFailure);");
            console.log(responseFailure);
            if (responseFailure.status === 403) {
                localStorageService.set("authorizationData", "");
                alert("forbidden");
                window.location = "https://localhost:44347/forbidden";
                window.href = "forbidden";

            } else if (responseFailure.status === 401) {

                localStorageService.set("authorizationData", "");
            }

            return this.q.reject(responseFailure);
        };

        return {
            request: request,
            responseError: responseError
        }
    }

    module.service("authorizationInterceptor", [
            '$q',
            'localStorageService',
            AuthorizationInterceptor
    ]);

    module.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("authorizationInterceptor");
    }]);

})();
