import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './home/home.component';
import {OverviewindexComponent} from './overviewindex/overviewindex.component';
import {CreateComponent} from './create/create.component';
import {AuthorizedComponent} from './authorized/authorized.component';
import {AuthorizeComponent} from './authorize/authorize.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {DetailsComponent} from './details/details.component';
import {LogoffComponent} from './logoff/logoff.component';
import { SecurityService } from './services/SecurityService';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.component.css']
})

@RouteConfig([
        { path: '/Home', name: 'Home', component: HomeComponent, useAsDefault: true },
        { path: '/Create', name: 'Create', component: CreateComponent },
        { path: '/Overviewindex', name: 'Overviewindex', component: OverviewindexComponent },
        { path: '/Authorize', name: 'Authorize', component: AuthorizeComponent },
        { path: '/Authorized', name: 'Authorized', component: AuthorizedComponent },
        { path: '/Forbidden', name: 'Forbidden', component: ForbiddenComponent },
        { path: '/Unauthorized', name: 'Unauthorized', component: UnauthorizedComponent },
        { path: '/Details/:id', name: 'Details', component: DetailsComponent },
        { path: '/Logoff', name: 'Logoff', component: LogoffComponent }
])
 
export class AppComponent {

    constructor(private _securityService: SecurityService) {
        this.HasAdminRole = _securityService.HasAdminRole;
        this.IsAuthorized = _securityService.IsAuthorized;
    }

    public IsAuthorized: boolean = false;
    public HasAdminRole: boolean = false;
}