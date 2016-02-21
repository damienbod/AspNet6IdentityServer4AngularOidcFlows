import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';

@Component({
    selector: 'overviewindex',
    templateUrl: 'app/overviewindex/overviewindex.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class OverviewindexComponent implements OnInit {

    public message: string;
    public DataEventRecords: any[];

    constructor(private _dataEventRecordsService: DataEventRecordsService) {
        this.message = "OverviewindexComponent constructor";
    }
    
    ngOnInit() {
        this._dataEventRecordsService
        .GetAll()
            .subscribe((data: any[]) => this.DataEventRecords = data,
                error => console.log(error),
                () => console.log('Get all complete'));
    }
}
