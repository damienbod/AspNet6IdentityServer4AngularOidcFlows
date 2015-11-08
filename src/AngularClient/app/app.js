(function () {
    var mainApp = angular.module("mainApp", ["ui.router", "LocalStorageModule"]);

    mainApp.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/authorized");

        $stateProvider
            .state("authorized", {
                url: "/authorized",
                templateUrl: "/templates/authorized.html",
                controller: "AuthorizedController"
            })
		        .state("home", { abstract: true, url: "/home", templateUrl: "/templates/home.html" })
                  
		        .state("overview", {
		            abstract: true,
		            parent: "home",
		            url: "/overview",
		            templateUrl: "/templates/overview.html"
		        })
		        .state("details", {
		            parent: "overview",
		            url: "/details/:id",
		            templateUrl: "/templates/details.html",
		            controller: "DetailsController",
		            resolve: {
		                DataEventRecordsService: "DataEventRecordsService",

		                dataEventRecords: [
		                    "DataEventRecordsService", function(DataEventRecordsService) {
		                        return DataEventRecordsService.GetDataEventRecords();
		                    }
		                ],
		                dataEventRecord: [
		                    "DataEventRecordsService", "$stateParams", function(DataEventRecordsService, $stateParams) {
		                        var id = $stateParams.id;
		                        console.log($stateParams.id);
		                        return DataEventRecordsService.GetDataEventRecord({ id: id });
		                    }
		                ]
		            }
		        })
                .state("overviewindex", {
                    parent: "overview",
                    url: "/overviewindex",
                    templateUrl: "/templates/overviewindex.html",
                    controller: "OverviewController",
                    resolve: {
                        DataEventRecordsService: "DataEventRecordsService",

                        dataEventRecords: [
		                    "DataEventRecordsService", function(DataEventRecordsService) {
		                        return DataEventRecordsService.GetDataEventRecords();
		                    }
                        ]
                    }
                })
		        .state("create", {
		            parent: "overview",
		            url: "/create",
		            templateUrl: "/templates/create.html",
		            controller: "DetailsController",
		            resolve: {
		                dataEventRecords: [
		                    "DataEventRecordsService", function(DataEventRecordsService) {
		                        return DataEventRecordsService.GetDataEventRecords();
		                    }
		                ],
		                dataEventRecord: [
		                    function() {
		                        return { Id: "", Name: "", Description: "", Timestamp: "2015-08-28T09:57:32.4669632" };
		                    }
		                ]

		            }
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