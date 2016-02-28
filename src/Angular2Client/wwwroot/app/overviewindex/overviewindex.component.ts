import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';
import { SecurityService } from '../services/SecurityService';
import {Observable}       from 'rxjs/Observable';

@Component({
    selector: 'overviewindex',
    templateUrl: 'app/overviewindex/overviewindex.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class OverviewindexComponent implements OnInit {

    public message: string;
    public DataEventRecords: any[];
   
    constructor(private _dataEventRecordsService: DataEventRecordsService, public securityService: SecurityService) {
        this.message = "Overview DataEventRecords";

    }

    ngOnInit() {
        this._dataEventRecordsService
            .GetAll()
            .subscribe((data: any[]) => this.DataEventRecords = data,
            error => console.log(error),
            () => console.log('Get all completed'));
    }

    public Delete(id: any) {
        console.log("Try to delete" + id);
        this._dataEventRecordsService.Delete(id);
    }
}
