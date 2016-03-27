import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../../services/DataEventRecordsService';
import { RouteParams, Router } from 'angular2/router';
import { SecurityService } from '../../services/SecurityService';
import { DataEventRecord } from '../../models/DataEventRecord';

@Component({
    selector: 'dataeventrecordedit',
    templateUrl: 'app/dataeventrecord/dataeventrecordedit/dataeventrecordedit.component.html',
    directives: [CORE_DIRECTIVES]
})

export class DataeventrecordeditComponent implements OnInit {

    private id: number;
    public message: string;
    public DataEventRecord: DataEventRecord;

    constructor(private _dataEventRecordsService: DataEventRecordsService,
            private _routeParams: RouteParams,
            public securityService: SecurityService,
            private _router: Router) {
        this.message = "DataeventrecordeditComponent constructor";
        this.id = +this._routeParams.get('Id');
        this.DataEventRecord = { Id: this.id, Name: "", Description: "", Timestamp: "" };
    }
    
    ngOnInit() {     
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
        this._dataEventRecordsService.GetById(this.id)
            .subscribe( data => this.DataEventRecord = data,
                error => this.securityService.HandleError(error),
                () => console.log('DetailsComponent:Get by Id complete'));
    }

    public Update() {
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((() => console.log("subscribed")),
            error => this.securityService.HandleError(error),
            () => this._router.navigate(['Dataeventrecords']));
    }
}
