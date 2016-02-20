(function () {
    var mainApp = angular.module("mainApp", ["ui.router", "LocalStorageModule"]);

    mainApp.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/unauthorized");

        $stateProvider
            .state("authorized", {
                url: "/authorized",
                templateUrl: "/templates/authorized.html",
                controller: "AuthorizeController"
            })
            .state("forbidden", { url: "/forbidden", templateUrl: "/templates/forbidden.html" })
            .state("unauthorized", { url: "/unauthorized", templateUrl: "/templates/unauthorized.html" })
            .state("logoff", { url: "/logoff", templateUrl: "/templates/unauthorized.html", controller: "LogoffController" })
        
		    .state("details", {
		        url: "/details/:id",
		        templateUrl: "/templates/details.html",
		        controller: "DetailsController",
		        resolve: {
		            DataEventRecordsService: "DataEventRecordsService",
		            dataEventRecord: [
		                "DataEventRecordsService", "$stateParams", function (DataEventRecordsService, $stateParams) {
		                    var id = $stateParams.id;
		                    console.log($stateParams.id);
		                    return DataEventRecordsService.GetDataEventRecord({ id: id });
		                }
		            ]
		        }
		    })
            .state("overviewindex", {
                url: "/overviewindex",
                templateUrl: "/templates/overviewindex.html",
                controller: "OverviewController",
                resolve: {
                    DataEventRecordsService: "DataEventRecordsService",
                    dataEventRecords: [
		                "DataEventRecordsService", function (DataEventRecordsService) {
		                    return DataEventRecordsService.GetDataEventRecords();
		                }
                    ]
                }
            })
		    .state("create", {
		        url: "/create",
		        templateUrl: "/templates/create.html",
		        controller: "DetailsController",
		        resolve: {		     
		            dataEventRecord: [
		                function () {
		                    return { Id: "", Name: "", Description: "", Timestamp: "2016-02-15T08:57:32" };
		                }
		            ]
		        }
		    })
            .state("reload", {
		        url: "/reload/:destinationState",
		        controller: ["$state", "$stateParams", function ($state, $stateParams) {
		            if ($stateParams.destinationState) {
		                $state.go($stateParams.destinationState);
		            }
		            else {
		                $state.go("overviewindex");
		            }
		        }]
		    });
          
		    $locationProvider.html5Mode(true);
		}
    ]
    );

    mainApp.run(["$rootScope", function ($rootScope) {

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.log(event);
            console.log(toState);
            console.log(toParams);
            console.log(fromState);
            console.log(fromParams);
            console.log(error);
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            console.log(event);
            console.log(unfoundState);
            console.log(fromState);
            console.log(fromParams);
        });

    }]);

})();