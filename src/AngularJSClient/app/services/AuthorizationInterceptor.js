(function () {
    'use strict';

    var module = angular.module('mainApp');

    function AuthorizationInterceptor($q, localStorageService) {

        console.log("AuthorizationInterceptor created");

        var request = function (requestSuccess) {
            requestSuccess.headers = requestSuccess.headers || {};

            if (localStorageService.get("authorizationData") !== "") {
                requestSuccess.headers.Authorization = 'Bearer ' + localStorageService.get("authorizationData");
            }

            return requestSuccess || $q.when(requestSuccess);
        };

        var responseError = function(responseFailure) {

            console.log("console.log(responseFailure);");
            console.log(responseFailure);
            if (responseFailure.status === 403) {
                alert("forbidden");
                window.location = "https://localhost:44347/forbidden";
                window.href = "forbidden";

            } else if (responseFailure.status === 401) {

                alert("unauthorized");
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
