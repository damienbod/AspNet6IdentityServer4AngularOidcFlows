"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var app_constants_1 = require('./app.constants');
var SecurityService_1 = require('./services/SecurityService');
var app_routes_1 = require('./app.routes');
var forbidden_component_1 = require('./forbidden/forbidden.component');
var home_component_1 = require('./home/home.component');
var unauthorized_component_1 = require('./unauthorized/unauthorized.component');
var dataeventrecords_module_1 = require('./dataeventrecords/dataeventrecords.module');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                forbidden_component_1.ForbiddenComponent,
                home_component_1.HomeComponent,
                unauthorized_component_1.UnauthorizedComponent,
                http_1.HTTP_PROVIDERS,
                app_constants_1.Configuration,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routes_1.routing,
                dataeventrecords_module_1.DataEventRecordsModule
            ],
            providers: [
                SecurityService_1.SecurityService
            ],
            bootstrap: [app_component_1.AppComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map