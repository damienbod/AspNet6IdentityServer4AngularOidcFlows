import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { SecurityService } from '../services/SecurityService';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords-edit',
    templateUrl: 'app/dataeventrecords/dataeventrecords-edit.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})

export class DataEventRecordsEditComponent implements OnInit {

    private id: number;
    public message: string;
    public DataEventRecord: DataEventRecord;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        private _routeParams: RouteParams,
        public securityService: SecurityService,
        private _router: Router
    ) {
        this.message = "DataEventRecords Edit";
        this.id = +this._routeParams.get('id');
    }
    
    ngOnInit() {     
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
        let id = +this._routeParams.get('id');

        if (!this.DataEventRecord) {
            this._dataEventRecordsService.GetById(id)
                .subscribe(data => this.DataEventRecord = data,
                error => this.securityService.HandleError(error),
                () => console.log('DataEventRecordsEditComponent:Get by Id complete'));
        } 
    }

    public Update() {
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((() => console.log("subscribed")),
            error => this.securityService.HandleError(error),
            () => this._router.navigate(['DataEventRecordsList']));
    }
}
