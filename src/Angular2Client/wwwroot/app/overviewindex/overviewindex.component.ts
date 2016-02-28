import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'overviewindex',
    templateUrl: 'app/overviewindex/overviewindex.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class OverviewindexComponent implements OnInit {

    public message: string;
    public DataEventRecords: any[];
    public IsAuthorized: boolean = false;
    public HasAdminRole: boolean = false;

    constructor(private _dataEventRecordsService: DataEventRecordsService, private _securityService: SecurityService) {
        this.message = "OverviewindexComponent constructor";
        this.HasAdminRole = _securityService.HasAdminRole;
        this.IsAuthorized = _securityService.IsAuthorized;
    }
    
    ngOnInit() {
        this._dataEventRecordsService
        .GetAll()
            .subscribe((data: any[]) => this.DataEventRecords = data,
                error => console.log(error),
                () => console.log('Get all complete'));
    }

    public Delete(id: any) {
        console.log("Try to delete" + id);
        this._dataEventRecordsService.Delete(id);
    }
}
