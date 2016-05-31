"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var router_deprecated_1 = require('@angular/router-deprecated');
var app_component_1 = require('./app.component');
var app_constants_1 = require('./app.constants');
var SecurityService_1 = require('./services/SecurityService');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    router_deprecated_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    app_constants_1.Configuration,
    SecurityService_1.SecurityService
]);
//# sourceMappingURL=boot.js.map