import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from '../../auth/services/oidc.security.service';

import { DataEventRecordsService } from '../dataeventrecords.service';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
    selector: 'app-dataeventrecords-edit',
    templateUrl: 'dataeventrecords-edit.component.html'
})

export class DataEventRecordsEditComponent implements OnInit, OnDestroy   {

    private id = 0;
    public message: string;
    private sub: any;
    public DataEventRecord: DataEventRecord = {
        Id: 0,
        Name: '',
        Description: '',
        Timestamp: ''
    }
    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(
        private _dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.message = 'DataEventRecords Edit';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
        console.log('IsAuthorized:' + this.isAuthorized);

        this.sub = this._route.params.subscribe(params => {
            const id = +params['id']; // (+) converts string 'id' to a number
            this.id = id;
            if (this.DataEventRecord.Id === 0) {
                this._dataEventRecordsService.GetById(id)
                    .subscribe(data => this.DataEventRecord = data,
                    error => this.oidcSecurityService.handleError(error),
                    () => console.log('DataEventRecordsEditComponent:Get by Id complete'));
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }

    public Update() {
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((() => console.log('subscribed')),
            error => this.oidcSecurityService.handleError(error),
            () => this._router.navigate(['/dataeventrecords']));
    }
}
