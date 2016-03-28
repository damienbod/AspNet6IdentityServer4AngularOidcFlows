import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { Router } from 'angular2/router';

import { DataEventRecordsService } from '../dataeventrecord/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords',
    templateUrl: 'app/dataeventrecord/dataeventrecords.component.html',
    directives: [CORE_DIRECTIVES]
})

export class DataEventRecordsComponent implements OnInit {

    public message: string;
    public DataEventRecords: DataEventRecord[];
   
    constructor(private _dataEventRecordsService: DataEventRecordsService, public securityService: SecurityService, private _router: Router) {
        this.message = "DataEventRecordsComponent";
    }

    ngOnInit() {
        this.getData();
    }

    public Delete(id: any) {
        console.log("Try to delete" + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((() => console.log("subscribed")),
            error => this.securityService.HandleError(error),
            () => this.getData());
    }

    private getData() {
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.securityService.HandleError(error),
            () => console.log('Get all completed'));
    }

}
