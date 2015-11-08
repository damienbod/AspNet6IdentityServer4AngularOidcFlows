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
            "$rootScope",
			OverviewController
		]
	);

	function OverviewController($scope, $log, dataEventRecords, DataEventRecordsService, $state, $rootScope) {

		$log.info("OverviewController called");
		$scope.message = "Overview";
		if ($rootScope.authorizationData === null) {
		    $scope.message = "not authorized";
		    $state.go("authorized");
		}
		
		$scope.DataEventRecordsService = DataEventRecordsService;

		$log.info(dataEventRecords);
		$scope.dataEventRecords = dataEventRecords;
	
		$scope.Delete = function (id) {
		    $log.info("deleting");
		    $scope.DataEventRecordsService.DeleteDataEventRecord(id);
		};
	}
})();
