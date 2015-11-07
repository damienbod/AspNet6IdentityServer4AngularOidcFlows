(function () {
	'use strict';

	var module = angular.module("mainApp");

	// this code can be used with uglify
	module.controller("AuthorizedController",
		[
			"$scope",
			"$log",
			AuthorizedController
		]
	);

	function AuthorizedController($scope, $log ) {
	    $log.info("AuthorizedController called");
		$scope.message = "AuthorizedController";
	
	
	}
})();
