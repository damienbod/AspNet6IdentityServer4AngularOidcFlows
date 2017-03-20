import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from '../auth/services/oidc.security.service';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords-edit',
    templateUrl: 'dataeventrecords-edit.component.html'
})

export class DataEventRecordsEditComponent implements OnInit, OnDestroy   {

    private id: number;
    public message: string;
    private sub: any;
    public DataEventRecord: DataEventRecord;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public securityService: OidcSecurityService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.message = 'DataEventRecords Edit';
    }

    ngOnInit() {
        console.log('IsAuthorized:' + this.securityService.IsAuthorized());
        console.log('HasAdminRole:' + this.securityService.HasAdminRole);

        this.sub = this._route.params.subscribe(params => {
            let id = +params['id']; // (+) converts string 'id' to a number
            if (!this.DataEventRecord) {
                this._dataEventRecordsService.GetById(id)
                    .subscribe(data => this.DataEventRecord = data,
                    error => this.securityService.HandleError(error),
                    () => console.log('DataEventRecordsEditComponent:Get by Id complete'));
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public Update() {
        // router navigate to DataEventRecordsList
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((() => console.log('subscribed')),
            error => this.securityService.HandleError(error),
            () => this._router.navigate(['/dataeventrecords']));
    }
}
