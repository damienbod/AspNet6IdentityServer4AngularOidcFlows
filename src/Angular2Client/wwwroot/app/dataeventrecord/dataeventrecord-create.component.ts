import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router } from 'angular2/router';
import { SecurityService } from '../services/SecurityService';

import { DataEventRecordsService } from '../dataeventrecord/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecord-create',
    templateUrl: 'app/dataeventrecord/dataeventrecord-create.component.html',
    directives: [CORE_DIRECTIVES]
})

export class DataEventRecordCreateComponent implements OnInit {

    public message: string;
    public DataEventRecord: any;

    constructor(private _dataEventRecordsService: DataEventRecordsService, public securityService: SecurityService, private _router: Router) {
        this.message = "DataEventRecordCreateComponent constructor";
    }
    
    ngOnInit() {
        this.DataEventRecord = { Id: 0, Name: "", Description: "" };
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
    }

    public Create() {
        this._dataEventRecordsService
            .Add(this.DataEventRecord)
            .subscribe((data: any) => this.DataEventRecord = data,
            error => this.securityService.HandleError(error),
            () => this._router.navigate(['Dataeventrecords']));
    }

    
}
