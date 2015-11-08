(function () {
	'use strict';

	var module = angular.module("mainApp");

	// this code can be used with uglify
	module.controller("AuthorizedController",
		[
			"$scope",
			"$log",
            "$window",
            "$state",
            "localStorageService",
			AuthorizedController
		]
	);

	function AuthorizedController($scope, $log, $window, $state, localStorageService) {
	    $log.info("AuthorizedController called");
		$scope.message = "AuthorizedController created";
	
	    localStorageService.set("authorizationData", "");
	    //localStorageService.get("authorizationData");
	    //localStorageService.set("authStateControl", "");
	    //localStorageService.get("authStateControl");

	    console.log(localStorageService.get("authorizationData"));

		//var authorizationData = localStorage.getItem("authorizationData");

	    if (localStorageService.get("authorizationData") !== "") {
		    $scope.message = "AuthorizedController created logged on";
		   // console.log(authorizationData);
		    $state.go("overview");
		} else {
		    console.log("AuthorizedController created, no auth data");
		    if ($window.location.hash) {
		        console.log("AuthorizedController created, has hash");
		        $scope.message = "AuthorizedController created with a code";

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
		                    token = result.access_token;
		                }
		            }

		            localStorageService.set("authorizationData", token);
		            console.log(localStorageService.get("authorizationData"));

		            $state.go("overview");

		        } else {
		            $scope.message = "AuthorizedController time to log on";
		            
		            //localStorage.removeItem('authorizationData');

		            var authorizationUrl = 'https://localhost:44300/connect/authorize';
		            var client_id = 'angularclient';
		            var redirect_uri = 'https://localhost:44302/authorized';
		            var response_type = "token";
		            var scope = "dataEventRecords";
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
})();
