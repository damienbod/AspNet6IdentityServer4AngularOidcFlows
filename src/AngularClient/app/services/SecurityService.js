(function () {
    'use strict';

    function SecurityService($http, $log, $q, $rootScope,  $window, $state, localStorageService) {
        $log.info("SecurityService called");

        var baseUrl = "https://localhost:44390/";

        var ResetAuthorizationData = function () {
        }

        var SetAuthorizationData = function (token) {
        }

        var Authorize = function () {
            localStorageService.set("authorizationData", "");

            console.log(localStorageService.get("authorizationData"));

            if (localStorageService.get("authorizationData") !== "") {
                console.log("AuthorizedController created logged on");
                // console.log(authorizationData);
                $state.go("overviewindex");
            } else {
                console.log("AuthorizedController created, no auth data");
                if ($window.location.hash) {
                    console.log("AuthorizedController created, has hash");
                    console.log("AuthorizedController created with a code");

                    var hash = window.location.hash.substr(1);

                    var result = hash.split('&').reduce(function (result, item) {
                        var parts = item.split('=');
                        result[parts[0]] = parts[1];
                        return result;
                    }, {});

                    var token = "";
                    if (!result.error) {
                        if (result.state !== localStorageService.get("authStateControl")) {
                            console.log("AuthorizedController created. no myautostate");
                        } else {
                            localStorageService.set("authStateControl", "");
                            console.log("AuthorizedController created. returning access token");
                            console.log(result);
                           
                            token = result.access_token;
                            var data = getClaimsFromToken(token);
                            console.log(data);
                            $log.info(data);
                            alert("check the result");
                        }
                    }

                    localStorageService.set("authorizationData", token);
                    console.log(localStorageService.get("authorizationData"));

                    $state.go("overviewindex");

                } else {
                    console.log("AuthorizedController time to log on");

                    //localStorage.removeItem('authorizationData');

                    var authorizationUrl = 'https://localhost:44345/connect/authorize';
                    var client_id = 'angularclient';
                    var redirect_uri = 'https://localhost:44347/authorized';
                    var response_type = "token";
                    var scope = "dataEventRecords aReallyCoolScope";
                    var state = Date.now() + "" + Math.random();

                    localStorageService.set("authStateControl", state);
                    console.log("AuthorizedController created. adding myautostate: " + localStorageService.get("authStateControl"));

                    var url =
                        authorizationUrl + "?" +
                        "client_id=" + encodeURI(client_id) + "&" +
                        "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                        "response_type=" + encodeURI(response_type) + "&" +
                        "scope=" + encodeURI(scope) + "&" +
                        "state=" + encodeURI(state);


                    $window.location = url;
                }
            }
        }

        var Logoff = function () {

        }


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

        function getClaimsFromToken(token) {
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

		return {
		    ResetAuthorizationData: ResetAuthorizationData,
		    SetAuthorizationData: SetAuthorizationData,
		    Authorize: Authorize,
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
