(function () {
    'use strict';

    function SecurityService($http, $log, $q, $rootScope,  $window, $state, localStorageService) {
        $log.info("SecurityService called");

        $rootScope.IsAuthorized = false;
        $rootScope.HasAdminRole = false;

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getDataFromToken(token) {
            var data = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                data = JSON.parse(urlBase64Decode(encoded));
            }
            return data;
        }

        var ResetAuthorizationData = function () {
            localStorageService.set("authorizationData", "");
            localStorageService.set("authorizationDataIdToken", "");
            $rootScope.IsAuthorized = false;
            $rootScope.HasAdminRole = false;
        }

        var SetAuthorizationData = function (token, id_token) {
            
            if (localStorageService.get("authorizationData") !== "") {
                localStorageService.set("authorizationData", "");
            }

            localStorageService.set("authorizationData", token);
            localStorageService.set("authorizationDataIdToken", id_token);
            $rootScope.IsAuthorized = true;

            var data = getDataFromToken(token);
            for (var i = 0; i < data.role.length; i++) {
                if (data.role[i] === "dataEventRecords.admin") {
                    $rootScope.HasAdminRole = true;                    
                }
            }
        }

        var authorize = function () {
            console.log("AuthorizedController time to log on");

            //GET /authorize?
            //response_type=code%20id_token
            //&client_id=s6BhdRkqt3
            //&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
            //&scope=openid%20profile%data
            //&nonce=n-0S6_WzA2Mj
            //&state=af0ifjsldkj HTTP/1.1

            var authorizationUrl = 'https://localhost:44318/connect/authorize';
            var client_id = 'angularjsclient';
            var redirect_uri = 'https://localhost:44376/authorized';
            var response_type = "id_token token";
            var scope = "dataEventRecords securedFiles openid";
            var nonce = "N" + Math.random() + "" + Date.now();
            var state = Date.now() + "" + Math.random();

            localStorageService.set("authNonce", nonce);
            localStorageService.set("authStateControl", state);
            console.log("AuthorizedController created. adding myautostate: " + localStorageService.get("authStateControl"));

            var url =
                authorizationUrl + "?" +
                "response_type=" + encodeURI(response_type) + "&" +
                "client_id=" + encodeURI(client_id) + "&" +
                "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                "scope=" + encodeURI(scope) + "&" +
                "nonce=" + encodeURI(nonce) + "&" +
                "state=" + encodeURI(state);

            $window.location = url;
        }

        var authorizeCallback = function () {
            console.log("AuthorizedController created, has hash");
            var hash = window.location.hash.substr(1);

            var result = hash.split('&').reduce(function (result, item) {
                var parts = item.split('=');
                result[parts[0]] = parts[1];
                return result;
            }, {});

            var token = "";
            var id_token = "";
            var authResponseIsValid = false;
            if (!result.error) {
                
                    if (result.state !== localStorageService.get("authStateControl")) {
                        console.log("AuthorizedCallback incorrect state");
                    } else {

                        token = result.access_token;
                        id_token = result.id_token

                        var dataIdToken = getDataFromToken(id_token);
                        console.log(dataIdToken);

                        // validate nonce
                        if (dataIdToken.nonce !== localStorageService.get("authNonce")) {
                            console.log("AuthorizedCallback incorrect nonce");
                        } else {
                            localStorageService.set("authNonce", "");
                            localStorageService.set("authStateControl", "");

                            authResponseIsValid = true;
                            console.log("AuthorizedCallback state and nonce validated, returning access token");
                        }
                    }    
            }

            if (authResponseIsValid) {
                SetAuthorizationData(token, id_token);
                console.log(localStorageService.get("authorizationData"));

                $state.go("overviewindex");
            }
            else {
                ResetAuthorizationData();
                $state.go("unauthorized");
            }
            
        }

        var DoAuthorization = function () {
            ResetAuthorizationData();

            if ($window.location.hash) {
                authorizeCallback();
            }
            else {
                authorize();
            }
        }

        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://localhost:44346/unauthorized.html
        var Logoff = function () {
            //var id_token = localStorageService.get("authorizationDataIdToken");     
            //var authorizationUrl = 'https://localhost:44318/connect/endsession';
            //var id_token_hint = id_token;
            //var post_logout_redirect_uri = 'https://localhost:44346/unauthorized.html';
            //var state = Date.now() + "" + Math.random();

            //var url =
            //    authorizationUrl + "?" +
            //    "id_token_hint=" + id_token_hint + "&" +
            //    "post_logout_redirect_uri=" + encodeURI(post_logout_redirect_uri) + "&" +
            //    "state=" + encodeURI(state);

            //ResetAuthorizationData();
            //$window.location = url;

            // 19.02.2106: temp until connect/endsession is implemented in IdentityServer4 NOT A PROPER SOLUTION!
            ResetAuthorizationData();
            $window.location = "https://localhost:44346/unauthorized.html";
        }

        return {
            ResetAuthorizationData: ResetAuthorizationData,
            SetAuthorizationData: SetAuthorizationData,
            DoAuthorization: DoAuthorization,
            Logoff: Logoff
        }
    }

    var module = angular.module('mainApp');

    module.factory("SecurityService",
        [
            "$http",
            "$log",
            "$q",
            "$rootScope",
            "$window",
            "$state",
            "localStorageService",
            SecurityService
        ]
    );

})();
