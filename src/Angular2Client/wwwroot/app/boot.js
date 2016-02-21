var browser_1 = require('angular2/platform/browser');
var router_1 = require('angular2/router');
var http_1 = require('angular2/http');
var app_component_1 = require('./app.component');
var app_constants_1 = require('./app.constants');
var SecurityService_1 = require('./services/SecurityService');
browser_1.bootstrap(app_component_1.AppComponent, [
    router_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    app_constants_1.Configuration,
    SecurityService_1.SecurityService
]);
//# sourceMappingURL=boot.js.map