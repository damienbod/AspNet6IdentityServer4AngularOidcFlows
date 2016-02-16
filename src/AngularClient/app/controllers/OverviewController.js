(function () {
	'use strict';

	var module = angular.module("mainApp");

	// this code can be used with uglify
	module.controller("OverviewController",
		[
			"$scope",
			"$log",
			"dataEventRecords",
			"DataEventRecordsService",
            "$state",
            "localStorageService",
			OverviewController
		]
	);

	function OverviewController($scope, $log, dataEventRecords, DataEventRecordsService, $state, localStorageService) {

		$log.info("OverviewController called");
		$scope.message = "Overview";

		$scope.DataEventRecordsService = DataEventRecordsService;

		$log.info(dataEventRecords);
		$scope.dataEventRecords = dataEventRecords;
	
		$scope.IsAuthorized = false;

		if (localStorageService.get("authorizationData") !== "") {
		    $scope.IsAuthorized = true;
		}

		$scope.Delete = function (id) {
		    $log.info("deleting");
		    $scope.DataEventRecordsService.DeleteDataEventRecord(id).then(
		        function () {
		            $state.go($state.current, {}, { reload: true });
		        });;
		};
	}
})();
