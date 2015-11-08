//(function () {
//	'use strict';

//	var module = angular.module("mainApp");

//	var DataEventRecordsController = (function () {
//	    function AlarmsController(scope, log, dataEventRecordsService) {
//	        scope.Vm = this;

//	        this.dataEventRecordsService = dataEventRecordsService;
//	        this.log = log;
//	        this.log.info("DataEventRecords Controller called");
//	    }

//	    DataEventRecordsController.prototype.CreateNewAlarm = function () {
//	        console.log("CreateNewAlarm");
//	        var data = { AlarmType: this.AlarmType, Message: this.Message, Id:"" };
//	        this.dataEventRecordsService.AddAlarm(data);
//	    };

//	    DataEventRecordsController.prototype.DeleteDataEventRecord = function () {
//	        console.log("DeleteDataEventRecord event");
//	        this.dataEventRecordsService.DeleteDataEventRecord();
//	    };


//	    return DataEventRecordsController;
//	})();

//    // this code can be used with uglify
//	module.controller("dataEventRecordsController",
//		[
//			"$scope",
//			"$log",
//			"dataEventRecordsService",
//			DataEventRecordsController
//		]
//	);
//})();