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
			OverviewController
		]
	);

	function OverviewController($scope, $log, dataEventRecords, DataEventRecordsService) {
		$log.info("OverviewController called");
		$scope.message = "Overview";
		$scope.DataEventRecordsService = DataEventRecordsService;

		$log.info(dataEventRecords);
		$scope.dataEventRecords = dataEventRecords;
	
		$scope.Delete = function (id) {
		    $log.info("deleting");
		    $scope.DataEventRecordsService.DeleteDataEventRecord(id);
		};
	}
})();
