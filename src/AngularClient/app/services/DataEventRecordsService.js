(function () {
    'use strict';

    function DataEventRecordsService($http, $log, $q) {
        $log.info("DataEventRecordsService called");

        var baseUrl = "https://localhost:44303";
	    var AddDataEventRecord = function (dataEventRecord) {
	        var deferred = $q.defer();

	        console.log("addDataEventRecord started");
	        console.log(dataEventRecord);

	        $http({
	            url: baseUrl + 'api/DataEventRecords',
	            method: "POST",
	            data: dataEventRecord
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var UpdateDataEventRecord = function (dataEventRecord) {
	        var deferred = $q.defer();

	        console.log("addDataEventRecord started");
	        console.log(dataEventRecord);

	        $http({
	            url: baseUrl + 'api/DataEventRecords/' + dataEventRecord.Id,
	            method: "PUT",
	            data: dataEventRecord
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var DeleteDataEventRecord = function (id) {
	        var deferred = $q.defer();

	        console.log("DeleteDataEventRecord begin");
	        console.log(id);

	        $http({
	            url: baseUrl + 'api/DataEventRecords/' + id,
	            method: "DELETE",
	            data: ""
	        }).success(function (data) {
	            deferred.resolve(data);
	        }).error(function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    var GetDataEventRecords = function () {
	        $log.info("DataEventRecordService DataEventRecords called");

	        console.log("addDataEventRecord started");
	        console.log(dataEventRecord);

	        return $http.get(baseUrl + "/api/DataEventRecords")
			.then(function (response) {
			    return response.data;
			});
	    }

	    var GetDataEventRecord = function (id) {
	        $log.info("DataEventRecordService GetDataEventRecord called: " + id.id);
	        $log.info(id);

	        return $http.get(baseUrl + "/api/DataEventRecords/" + id.id)
			.then(function (response) {
			    return response.data;
			});
	    }

		return {
		    AddDataEventRecord: AddDataEventRecord,
		    UpdateDataEventRecord: UpdateDataEventRecord,
		    DeleteDataEventRecord: DeleteDataEventRecord,
		    GetDataEventRecords: GetDataEventRecords,
		    GetDataEventRecord: GetDataEventRecord
		}
	}

	var module = angular.module('mainApp');

	module.factory("DataEventRecordsService",
		[
			"$http",
			"$log",
            "$q",
			DataEventRecordsService
		]
	);

})();
