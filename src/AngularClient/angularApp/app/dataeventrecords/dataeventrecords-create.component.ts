import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OidcSecurityService } from '../auth/services/oidc.security.service';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords-create',
    templateUrl: 'dataeventrecords-create.component.html'
})

export class DataEventRecordsCreateComponent implements OnInit, OnDestroy {

    public message: string;
    public DataEventRecord: any;
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(private _dataEventRecordsService: DataEventRecordsService, public oidcSecurityService: OidcSecurityService, private _router: Router) {
        this.message = 'DataEventRecords Create';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
        this.DataEventRecord = { Id: 0, Name: '', Description: '' };
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
    }

    public Create() {
        // router navigate to DataEventRecordsList
        this._dataEventRecordsService
            .Add(this.DataEventRecord)
            .subscribe((data: any) => this.DataEventRecord = data,
            error => this.oidcSecurityService.handleError(error),
            () => this._router.navigate(['/dataeventrecords']));
    }
}
