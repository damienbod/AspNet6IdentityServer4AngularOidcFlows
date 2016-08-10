"use strict";
var router_1 = require('@angular/router');
var forbidden_component_1 = require('./forbidden/forbidden.component');
var home_component_1 = require('./home/home.component');
var unauthorized_component_1 = require('./unauthorized/unauthorized.component');
var securefiles_component_1 = require('./securefile/securefiles.component');
var appRoutes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'Forbidden', component: forbidden_component_1.ForbiddenComponent },
    { path: 'Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
    { path: 'securefile/securefiles', component: securefiles_component_1.SecureFilesComponent },
    { path: 'dataeventrecords', loadChildren: './dataeventrecords/dataeventrecords.module' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routes.js.map