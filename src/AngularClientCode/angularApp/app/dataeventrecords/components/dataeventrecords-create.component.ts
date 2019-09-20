import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OidcSecurityService } from '../../auth/services/oidc.security.service';

import { DataEventRecordsService } from '../dataeventrecords.service';

@Component({
    selector: 'app-dataeventrecords-create',
    templateUrl: 'dataeventrecords-create.component.html'
})

export class DataEventRecordsCreateComponent implements OnInit, OnDestroy {

    public message: string;
    public DataEventRecord: any;
    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(private _dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
        private _router: Router
    ) {
        this.message = 'DataEventRecords Create';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
        this.DataEventRecord = { id: 0, name: '', description: '' };
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
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
