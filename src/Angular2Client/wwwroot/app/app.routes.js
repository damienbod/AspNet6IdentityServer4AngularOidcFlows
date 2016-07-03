"use strict";
var router_1 = require('@angular/router');
var forbidden_component_1 = require('./forbidden/forbidden.component');
var home_component_1 = require('./home/home.component');
var unauthorized_component_1 = require('./unauthorized/unauthorized.component');
var securefiles_component_1 = require('./securefile/securefiles.component');
var dataeventrecords_routes_1 = require('./dataeventrecords/dataeventrecords.routes');
exports.routes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'Forbidden', component: forbidden_component_1.ForbiddenComponent },
    { path: 'Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
    { path: 'securefile/securefiles', component: securefiles_component_1.SecureFilesComponent }
].concat(dataeventrecords_routes_1.DataEventRecordsRoutes);
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
//# sourceMappingURL=app.routes.js.map