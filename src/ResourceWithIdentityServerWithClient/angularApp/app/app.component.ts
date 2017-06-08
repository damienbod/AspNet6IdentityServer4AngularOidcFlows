import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration } from './app.constants';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OidcSecurityUserService } from './auth/services/oidc.security.user-service';

import { DataEventRecordsService } from './dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './dataeventrecords/models/DataEventRecord';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DataEventRecordsListComponent } from './dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords/dataeventrecords-edit.component';

import './app.component.scss';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

    hasAdminRole = true;
    hasDataEventRecordsAdminRole = true;

    constructor(
        public securityService: OidcSecurityService,
        public oidcSecurityUserService: OidcSecurityUserService
    ) {
    }

    ngOnInit() {
        console.log('ngOnInit _securityService.AuthorizedCallback');

        if (window.location.hash) {
            this.securityService.authorizedCallback();
        }
    }

    public Login() {
        console.log('Do login logic');
        this.securityService.authorize();
    }

    public Logout() {
        console.log('Do logout logic');
        this.securityService.logoff();
    }
}