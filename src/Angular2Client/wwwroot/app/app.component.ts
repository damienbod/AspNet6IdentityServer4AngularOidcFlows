import {Component} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
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
        DataEventRecordsService
    ]
})

@Routes([
        { path: '/Forbidden', component: ForbiddenComponent },
        { path: '/Unauthorized', component: UnauthorizedComponent },
        { path: '/securefile/securefiles', component: SecureFilesComponent },
        { path: '/dataeventrecords/...',  component: DataEventRecordsComponent },
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