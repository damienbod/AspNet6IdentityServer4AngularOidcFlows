import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
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
    hasAdminRole = false;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public securityService: OidcSecurityService,
        private _router: Router) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        let userData = this.securityService.getUserData();

        for (let i = 0; i < userData.role.length; i++) {
            if (userData.role[i] === 'dataEventRecords.admin') {
                this.hasAdminRole = true;
            }
            if (userData.role[i] === 'admin') {
            }
        }

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
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.securityService.handleError(error),
            () => console.log('getData Get all completed'));
    }


}
