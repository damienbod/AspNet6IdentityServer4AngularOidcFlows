(function () {
    var mainApp = angular.module("mainApp", ["ui.router"]);

    mainApp.config(["$stateProvider", "$urlRouterProvider",
		function ($stateProvider, $urlRouterProvider) {
		    $urlRouterProvider.otherwise("/home/overview");

		    $stateProvider
                .state("home", { abstract: true, url: "/home", templateUrl: "/templates/home.html" })
                    .state("overview", {
                        parent: "home", url: "/overview", templateUrl: "/templates/overview.html", controller: "OverviewController",
                        resolve: {

                            DataEventRecordsService: "DataEventRecordsService",

                            dataEventRecords: ["DataEventRecordsService", function (DataEventRecordsService) {
                                return DataEventRecordsService.GetDataEventRecords();
                            }]
                        }
                    })
                    .state("details", {
                            parent: "overview", url: "/details/:id", templateUrl: "/templates/details.html", controller: "DetailsController",
                            resolve: {
                                DataEventRecordsService: "DataEventRecordsService",

                                dataEventRecord: ["DataEventRecordsService", "$stateParams", function (DataEventRecordsService, $stateParams) {
                                    var id = $stateParams.id;
                                    console.log($stateParams.id);
                                    return DataEventRecordsService.GetDataEventRecord({ id: id });
                                }]
                            }
                    })
                    .state("create", {
                        parent: "overview", url: "/create", templateUrl: "/templates/create.html", controller: "DetailsController",
                        resolve: {
                            dataEventRecord: [ function () {
                                return { Id: "", Name: "", Description: "", Timestamp: "2015-08-28T09:57:32.4669632" };
                            }]
                            
                        }
                    })
		}
    ]
    );

    mainApp.run(["$rootScope", function ($rootScope) {

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log(event);
            console.log(toState);
            console.log(toParams);
            console.log(fromState);
            console.log(fromParams);
            console.log(error);
        })

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log(event);
            console.log(unfoundState);
            console.log(fromState);
            console.log(fromParams);
        })

    }]);

})();