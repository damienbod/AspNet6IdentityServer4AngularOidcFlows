var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var router_1 = require('angular2/router');
var forbidden_component_1 = require('./forbidden/forbidden.component');
var unauthorized_component_1 = require('./unauthorized/unauthorized.component');
var SecurityService_1 = require('./services/SecurityService');
var securefiles_component_1 = require('./securefiles/securefiles.component');
var dataeventrecords_component_1 = require('./dataeventrecord/dataeventrecords/dataeventrecords.component');
var dataeventrecordcreate_component_1 = require('./dataeventrecord/dataeventrecordcreate/dataeventrecordcreate.component');
var dataeventrecordedit_component_1 = require('./dataeventrecord/dataeventrecordedit/dataeventrecordedit.component');
var AppComponent = (function () {
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
            directives: [router_1.ROUTER_DIRECTIVES],
            styleUrls: ['app/app.component.css']
        }),
        router_1.RouteConfig([
            { path: '/Forbidden', name: 'Forbidden', component: forbidden_component_1.ForbiddenComponent },
            { path: '/Unauthorized', name: 'Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
            { path: '/SecureFiles', name: 'SecureFiles', component: securefiles_component_1.SecureFilesComponent },
            { path: '/dataeventrecord', name: 'Dataeventrecords', component: dataeventrecords_component_1.DataeventrecordsComponent },
            { path: '/dataeventrecord/create', name: 'Dataeventrecordcreate', component: dataeventrecordcreate_component_1.DataeventrecordcreateComponent },
            { path: '/dataeventrecord/edit/:Id', name: 'Dataeventrecordedit', component: dataeventrecordedit_component_1.DataeventrecordeditComponent },
        ]), 
        __metadata('design:paramtypes', [SecurityService_1.SecurityService])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map