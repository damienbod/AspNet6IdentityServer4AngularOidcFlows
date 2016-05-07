System.register(['@angular/core', '@angular/router', './forbidden/forbidden.component', './unauthorized/unauthorized.component', './services/SecurityService', './securefile/securefiles.component', './dataeventrecords/dataeventrecords.component', './dataeventrecords/DataEventRecordsService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, forbidden_component_1, unauthorized_component_1, SecurityService_1, securefiles_component_1, dataeventrecords_component_1, DataEventRecordsService_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (forbidden_component_1_1) {
                forbidden_component_1 = forbidden_component_1_1;
            },
            function (unauthorized_component_1_1) {
                unauthorized_component_1 = unauthorized_component_1_1;
            },
            function (SecurityService_1_1) {
                SecurityService_1 = SecurityService_1_1;
            },
            function (securefiles_component_1_1) {
                securefiles_component_1 = securefiles_component_1_1;
            },
            function (dataeventrecords_component_1_1) {
                dataeventrecords_component_1 = dataeventrecords_component_1_1;
            },
            function (DataEventRecordsService_1_1) {
                DataEventRecordsService_1 = DataEventRecordsService_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(securityService) {
                    this.securityService = securityService;
                }
                AppComponent.prototype.ngOnInit = function () {
                    console.log("ngOnInit _securityService.AuthorizedCallback");
                    if (window.location.hash) {
                        this.securityService.AuthorizedCallback();
                    }
                };
                AppComponent.prototype.Login = function () {
                    console.log("Do login logic");
                    this.securityService.Authorize();
                };
                AppComponent.prototype.Logout = function () {
                    console.log("Do logout logic");
                    this.securityService.Logoff();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app.component.html',
                        styleUrls: ['app/app.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [
                            DataEventRecordsService_1.DataEventRecordsService
                        ]
                    }),
                    router_1.Routes([
                        { path: '/Forbidden', component: forbidden_component_1.ForbiddenComponent },
                        { path: '/Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
                        { path: '/securefile/securefiles', component: securefiles_component_1.SecureFilesComponent },
                        { path: '/dataeventrecords/...', component: dataeventrecords_component_1.DataEventRecordsComponent },
                    ]), 
                    __metadata('design:paramtypes', [SecurityService_1.SecurityService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map