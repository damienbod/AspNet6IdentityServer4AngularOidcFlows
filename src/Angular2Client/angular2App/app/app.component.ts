import { Component, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';

import { SecurityService } from './services/SecurityService';
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

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent implements OnInit {

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