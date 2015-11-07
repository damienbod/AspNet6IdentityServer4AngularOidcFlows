(function () {
	'use strict';

	var module = angular.module("mainApp");

	// this code can be used with uglify
	module.controller("AuthorizedController",
		[
			"$scope",
			"$log",
            "localStorageService",
            "$window",
			AuthorizedController
		]
	);

	function AuthorizedController($scope, $log, localStorageService, $window) {
	    $log.info("AuthorizedController called");
		$scope.message = "AuthorizedController created";
	
		var authorizationData = localStorageService.get('authorizationData');

		if (authorizationData) {
		    $scope.message = "AuthorizedController created logged on";
		    // auth is ok, redirect to data requests
		} else {
		        if (window.location.hash) {
		            console.log(window.location.hash);
		            //var token = processTokenCallback();
		            //localStorageService.set('authorizationData', token);

		        } else {
		            $scope.message = "AuthorizedController time to log on";
		            
		            localStorageService.remove('authorizationData');

		            var authorizationUrl = 'https://localhost:44300/connect/authorize';
		            var client_id = 'angularclient';
		            var redirect_uri = 'https://localhost:44302/authorized';
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
		}
	
	}
})();
