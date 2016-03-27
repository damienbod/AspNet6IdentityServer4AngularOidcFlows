import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';
import { SecurityService } from '../../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { Router } from 'angular2/router';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
    selector: 'dataeventrecords',
    templateUrl: 'app/dataeventrecord/dataeventrecords/dataeventrecords.component.html',
    directives: [CORE_DIRECTIVES]
})

export class DataeventrecordsComponent implements OnInit {

    public message: string;
    public DataEventRecords: DataEventRecord[];
   
    constructor(private _dataEventRecordsService: DataEventRecordsService, public securityService: SecurityService, private _router: Router) {
        this.message = "DataeventrecordsComponent ctor";
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
