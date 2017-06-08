import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { OidcSecurityUserService } from '../auth/services/oidc.security.user-service';
import { Observable }       from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';


@Component({
    selector: 'dataeventrecords-list',
    templateUrl: 'dataeventrecords-list.component.html'
})

export class DataEventRecordsListComponent implements OnInit {

    message: string;
    DataEventRecords: DataEventRecord[];
    hasAdminRole = true;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public securityService: OidcSecurityService,
        public oidcSecurityUserService: OidcSecurityUserService,
        private _router: Router) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        this.getData();
        let userdata = this.oidcSecurityUserService.userData;
        console.log(userdata);
        //this.hasAdminRole = userdata.

        //for(let i = 0; i < this.userData.role.length; i++) {
        //    if (this.userData.role[i] === 'dataEventRecords.admin') {
        //        this.hasAdminRole = true;
        //        this.store('HasAdminRole', true);
        //    }
        //    if (this.userData.role[i] === 'admin') {
        //        this.hasUserAdminRole = true;
        //        this.store('HasUserAdminRole', true);
        //    }
        //}
    }

    public Delete(id: any) {
        console.log('Try to delete' + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((() => console.log('subscribed')),
            error => this.securityService.handleError(error),
            () => this.getData());
    }

    private getData() {
        console.log('DataEventRecordsListComponent:getData starting...');
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.securityService.handleError(error),
            () => console.log('Get all completed'));
    }


}
