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

    public message: string;
    public DataEventRecords: DataEventRecord[];

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public securityService: OidcSecurityService,
        private _router: Router) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        this.getData();
    }

    public Delete(id: any) {
        console.log('Try to delete' + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((() => console.log('subscribed')),
            error => this.securityService.HandleError(error),
            () => this.getData());
    }

    private getData() {
        console.log('DataEventRecordsListComponent:getData starting...');
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.securityService.HandleError(error),
            () => console.log('Get all completed'));
    }

}
