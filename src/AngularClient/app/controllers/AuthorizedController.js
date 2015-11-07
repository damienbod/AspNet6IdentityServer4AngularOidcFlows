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
			AuthorizedController
		]
	);

	function AuthorizedController($scope, $log, $window, $state) {
	    $log.info("AuthorizedController called");
		$scope.message = "AuthorizedController created";
	
        // TEST always log in if this is called
		localStorage.removeItem("authorizationData");

		var authorizationData = localStorage["authorizationData"];

		if (authorizationData) {
		    $scope.message = "AuthorizedController created logged on";
		    console.log(authorizationData);
		    $state.go("overview");
		} else {
		    if ($window.location.hash) {
		        $scope.message = "AuthorizedController created with a code";

                    var hash = window.location.hash.substr(1);

		            var result = hash.split('&').reduce(function (result, item) {
		                var parts = item.split('=');
		                result[parts[0]] = parts[1];
		                return result;
		            }, {});

		            if (!result.error) {
		                if (result.state !== localStorage["state"]) {
		                    console.log("invalid state");
		                } else {

		                    localStorage.removeItem("state");
		                    return result.access_token;
		                }
		            }

		            localStorage["authorizationData"] = result.access_token;

		            $state.go("overview");

		        } else {
		            $scope.message = "AuthorizedController time to log on";
		            
		            localStorage.removeItem('authorizationData');

		            var authorizationUrl = 'https://localhost:44300/connect/authorize';
		            var client_id = 'angularclient';
		            var redirect_uri = 'https://localhost:44302/authorized';
		            var response_type = "token";
		            var scope = "dataEventRecords";
		            var state = Date.now() + "" + Math.random();

		            localStorage["state"] = state;

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
