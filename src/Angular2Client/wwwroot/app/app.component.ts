import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {SecurityService} from './services/SecurityService';
import {SecureFilesComponent} from './securefile/securefiles.component';

import {DataEventRecordsComponent} from './dataeventrecords/dataeventrecords.component';
import { DataEventRecordsService } from './dataeventrecords/DataEventRecordsService';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        DataEventRecordsService
    ]
})

@RouteConfig([
    { path: '/Forbidden', name: 'Forbidden', component: ForbiddenComponent },
    { path: '/Unauthorized', name: 'Unauthorized', component: UnauthorizedComponent },
    { path: '/securefile/securefiles', name: 'SecureFiles', component: SecureFilesComponent },
    { path: '/dataeventrecords/...', name: 'DataEventRecords', component: DataEventRecordsComponent, useAsDefault: true }
])

export class AppComponent {

    constructor(public securityService: SecurityService) {  
    }

    ngOnInit() {
        console.log("ngOnInit _securityService.AuthorizedCallback");

        if (window.location.hash) {
            this.securityService.AuthorizedCallback();
        }      
    }

    public Login() {
        console.log("Do login logic");
        this.securityService.Authorize(); 
    }

    public Logout() {
        console.log("Do logout logic");
        this.securityService.Logoff();
    }
}