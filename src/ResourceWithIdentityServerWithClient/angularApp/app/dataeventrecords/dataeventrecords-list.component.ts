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

    public message: string;
    public DataEventRecords: DataEventRecord[];
    hasAdminRole = false;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public securityService: OidcSecurityService,
        public oidcSecurityUserService: OidcSecurityUserService,
        private _router: Router
    ) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        let userData = this.oidcSecurityUserService.userData;

        for (let i = 0; i < userData.role.length; i++) {
            if (userData.role[i] === 'dataEventRecords.admin') {
                console.log('user is dataEventRecords.admin');
                this.hasAdminRole = true;
            }
            if (userData.role[i] === 'admin') {
                console.log('user is admin');
            }
        }

        console.log(userData);

        this.getData();
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
