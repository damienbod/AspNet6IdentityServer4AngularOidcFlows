(function () {
    'use strict';

    var module = angular.module('mainApp');

    function AuthorizationInterceptor($rootScope, $q, localStorageService) {

        console.log("AuthorizationInterceptor created");
        var processTokenCallback = function() {
            var hash = window.location.hash.substr(1);
            console.log(hash);
            var result = hash.split('&').reduce(function(result, item) {
                var parts = item.split('=');
                result[parts[0]] = parts[1];
                return result;
            }, {});

            

            if (!result.error) {
                if (result.state !== localStorage["state"]) {
                    show("invalid state");
                } else {
                    localStorage.removeItem("state");
                    return result.access_token;
                }
            }

            return null;
        }; 

        var request = function(requestSuccess) {

            requestSuccess.headers = requestSuccess.headers || {};
            var authorizationData = localStorageService.get('authorizationData');
           
            console.log(authorizationData);
            if (authorizationData) {
                requestSuccess.headers.Authorization = 'Bearer ' + authorizationData;
            } else {
                //if (window.location.hash) {
                //    console.log(window.location.hash);
                //    var token = processTokenCallback();
                //    localStorageService.set('authorizationData', token);

                //} else {
                //    requestSuccess.headers.Authorization = '';
                //}
                
            }

            return requestSuccess || $q.when(requestSuccess);

            //config.headers = config.headers || {};
            //if ($window.localStorage.getItem('token')) {

            //    config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
            //}
            //return config || $q.when(config);
        };

        var response = function(response) {
            //if (response.status === 401) {
            //    //  Redirect user to login page / signup Page. 
            //}
            //return response || $q.when(response);
        };

        var responseError = function(responseFailure) {

            console.log("console.log(responseFailure);");
            console.log(responseFailure);
            if (responseFailure.status === 403) {
                window.location.href = '/#/unauthorized';

            } else if (responseFailure.status === 401) {

                localStorageService.remove('authorizationData');

                //if (window.location.href && window.location.hash !== '#/logon') {

                //    this.lastPath = window.location.href;

                //    $rootScope.returnToState = this.rootScope.toState;
                //    $rootScope.returnToStateParams = this.rootScope.toStateParams;
                //}

                var authorizationUrl = 'https://localhost:44300/connect/authorize';
                var client_id = 'angularclient';
                var redirect_uri = 'https://localhost:44302/Index.html';
                var response_type = "token";
                var scope = "dataEventRecords";
                var state = Date.now() + "" + Math.random();

                localStorageService.set('state', state);

                var url =
                    authorizationUrl + "?" +
                    "client_id=" + encodeURI(client_id) + "&" +
                    "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                    "response_type=" + encodeURI(response_type) + "&" +
                    "scope=" + encodeURI(scope) + "&" +
                    "state=" + encodeURI(state);
                window.location = url;
            }

            return this.q.reject(responseFailure);
        };

        return {
            request: request,
            response: response,
            responseError: responseError
        }
    }

    module.service("authorizationInterceptor", [
            '$rootScope',
            '$q',
            'localStorageService',
            AuthorizationInterceptor
    ]);

    module.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("authorizationInterceptor");
    }]);

})();
