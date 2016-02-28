import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {OverviewindexComponent} from './overviewindex/overviewindex.component';
import {CreateComponent} from './create/create.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {DetailsComponent} from './details/details.component';
import {SecurityService} from './services/SecurityService';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.component.css']
})

@RouteConfig([
        { path: '/Create', name: 'Create', component: CreateComponent },
        { path: '/Overviewindex', name: 'Overviewindex', component: OverviewindexComponent },
        { path: '/Forbidden', name: 'Forbidden', component: ForbiddenComponent },
        { path: '/Unauthorized', name: 'Unauthorized', component: UnauthorizedComponent },
        { path: '/Details/:id', name: 'Details', component: DetailsComponent }
])
 
export class AppComponent {

    constructor(private _securityService: SecurityService) {
        this.HasAdminRole = _securityService.HasAdminRole;
        this.IsAuthorized = _securityService.IsAuthorized;
    }

    ngOnInit() {
        console.log("ctor AuthorizedComponent constructor");
        if (window.location.hash) {
            this._securityService.AuthorizedCallback();
        }      
    }

    public IsAuthorized: boolean = false;
    public HasAdminRole: boolean = false;

    public Login() {
        console.log("Do login logic");
        this._securityService.Authorize(); 
    }

    public Logout() {
        console.log("Do logout logic");
        this._securityService.Logoff();
    }
}