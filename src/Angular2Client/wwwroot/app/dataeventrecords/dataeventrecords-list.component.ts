import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords-list',
    templateUrl: 'app/dataeventrecords/dataeventrecords-list.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})

export class DataEventRecordsListComponent implements OnInit {

    public message: string;
    public DataEventRecords: DataEventRecord[];
   
    constructor(private _dataEventRecordsService: DataEventRecordsService, public securityService: SecurityService, private _router: Router) {
        this.message = "DataEventRecordsListComponent";
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
        console.log('DataEventRecordsListComponent:getData starting...');
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.securityService.HandleError(error),
            () => console.log('Get all completed'));
    }

}
