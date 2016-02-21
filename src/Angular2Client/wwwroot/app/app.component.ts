import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './home/home.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.component.css']
})

@RouteConfig([
    { path: '/Home', name: 'Home', component: HomeComponent, useAsDefault: true }
])
 
export class AppComponent { }