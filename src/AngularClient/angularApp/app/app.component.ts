import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Configuration } from './app.constants';

import { OidcSecurityService } from './auth/services/oidc.security.service';
import { SecureFileService } from './securefile/SecureFileService';
import { DataEventRecordsService } from './dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './dataeventrecords/models/DataEventRecord';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';

import { DataEventRecordsListComponent } from './dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords/dataeventrecords-edit.component';

import './app.component.css';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

    constructor(public securityService: OidcSecurityService) {
    }

    ngOnInit() {
        if (window.location.hash) {
            this.securityService.authorizedCallback();
        }
    }

    login() {
        console.log('start login');
        this.securityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.securityService.refreshSession();
    }

    logout() {
        console.log('start logoff');
        this.securityService.logoff();
    }
}