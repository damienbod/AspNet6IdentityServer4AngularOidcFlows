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
var home_component_1 = require('./home/home.component');
var overviewindex_component_1 = require('./overviewindex/overviewindex.component');
var create_component_1 = require('./create/create.component');
var authorized_component_1 = require('./authorized/authorized.component');
var forbidden_component_1 = require('./forbidden/forbidden.component');
var unauthorized_component_1 = require('./unauthorized/unauthorized.component');
var details_component_1 = require('./details/details.component');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            styleUrls: ['app/app.component.css']
        }),
        router_1.RouteConfig([
            { path: '/Home', name: 'Home', component: home_component_1.HomeComponent, useAsDefault: true },
            { path: '/Create', name: 'Create', component: create_component_1.CreateComponent },
            { path: '/Overviewindex', name: 'Overviewindex', component: overviewindex_component_1.OverviewindexComponent },
            { path: '/Authorized', name: 'Authorized', component: authorized_component_1.AuthorizedComponent },
            { path: '/Forbidden', name: 'Forbidden', component: forbidden_component_1.ForbiddenComponent },
            { path: '/Unauthorized', name: 'Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
            { path: '/Details', name: 'Details', component: details_component_1.DetailsComponent }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map