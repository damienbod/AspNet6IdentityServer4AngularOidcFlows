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
            "$rootScope",
			AuthorizedController
		]
	);

	function AuthorizedController($scope, $log, $window, $state, $rootScope) {
	    $log.info("AuthorizedController called");
		$scope.message = "AuthorizedController created";
	
        // TEST always log in if this is called
		$rootScope.authorizationData = null;
		console.log($rootScope.authorizationData);

		//var authorizationData = localStorage.getItem("authorizationData");

		if ($rootScope.authorizationData) {
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
		                if (result.state !== $rootScope.myautostate) {
                            // TODO this must be fixed
		                    console.log("AuthorizedController created. no myautostate");
		                    token = result.access_token;
		                } else {
		                    $rootScope.myautostate = null;
		                    console.log("AuthorizedController created. returning access token");
		                    token = result.access_token;
		                }
		            }

		            $rootScope.authorizationData = token;
		            console.log($rootScope.authorizationData);

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

		            $rootScope.myautostate = state;
		            console.log("AuthorizedController created. adding myautostate: " + $rootScope.myautostate);
		          
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
