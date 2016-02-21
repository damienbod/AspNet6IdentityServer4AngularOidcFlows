import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './home/home.component';
import {OverviewindexComponent} from './overviewindex/overviewindex.component';
import {CreateComponent} from './create/create.component';
import {AuthorizedComponent} from './authorized/authorized.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';

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
        { path: '/Authorized', name: 'Authorized', component: AuthorizedComponent },
        { path: '/Forbidden', name: 'Forbidden', component: ForbiddenComponent }
])
 
export class AppComponent { }