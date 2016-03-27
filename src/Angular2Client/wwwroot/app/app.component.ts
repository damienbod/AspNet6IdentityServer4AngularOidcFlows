import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {SecurityService} from './services/SecurityService';
import {SecureFilesComponent} from './securefiles/securefiles.component';

import {DataeventrecordsComponent} from './dataeventrecord/dataeventrecords/dataeventrecords.component';
import {DataeventrecordcreateComponent} from './dataeventrecord/dataeventrecordcreate/dataeventrecordcreate.component';
import {DataeventrecordeditComponent} from './dataeventrecord/dataeventrecordedit/dataeventrecordedit.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.component.css']
})

@RouteConfig([
        { path: '/Forbidden', name: 'Forbidden', component: ForbiddenComponent },
        { path: '/Unauthorized', name: 'Unauthorized', component: UnauthorizedComponent },
        { path: '/SecureFiles', name: 'SecureFiles', component: SecureFilesComponent },
        { path: '/dataeventrecord', name: 'Dataeventrecords', component: DataeventrecordsComponent },
        { path: '/dataeventrecord/create', name: 'Dataeventrecordcreate', component: DataeventrecordcreateComponent },
        { path: '/dataeventrecord/edit/:Id', name: 'Dataeventrecordedit', component: DataeventrecordeditComponent },
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