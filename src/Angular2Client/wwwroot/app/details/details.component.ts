import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';
import { RouteParams, Router } from 'angular2/router';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'details',
    templateUrl: 'app/details/details.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class DetailsComponent implements OnInit {

    private id: any;
    public message: string;
    public DataEventRecord: any;

    constructor(private _dataEventRecordsService: DataEventRecordsService, private _routeParams: RouteParams, public securityService: SecurityService) {
        this.message = "DetailsComponent constructor";
        this.id = this._routeParams.get('Id');
        this.DataEventRecord = { Id: this.id, Name: "", Description: "", Timestamp: "" };
    }
    
    ngOnInit() {     
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
        this._dataEventRecordsService.GetById(this.id)
            .subscribe((data: any[]) => this.DataEventRecord = data,
                error => console.log(error),
                () => console.log('DetailsComponent:Get by Id complete'));
    }

    public Update() {
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((data: any) => this.DataEventRecord = data,
            error => console.log(error),
            () => console.log('Update complete'));
    }
}
