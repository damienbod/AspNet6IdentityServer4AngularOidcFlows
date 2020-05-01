import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OidcSecurityService } from '../../auth/angular-auth-oidc-client';

import { DataEventRecordsService } from '../dataeventrecords.service';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
    selector: 'app-dataeventrecords-create',
    templateUrl: 'dataeventrecords-create.component.html'
})

export class DataEventRecordsCreateComponent implements OnInit {

    message: string;
    DataEventRecord: DataEventRecord = {
        id: 0, name: '', description: '', timestamp: ''
    };

    isAuthenticated$: Observable<boolean>;

    constructor(private _dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
        private _router: Router
    ) {
        this.message = 'DataEventRecords Create';
    }

    ngOnInit() {
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.isAuthenticated$.pipe(
            map((isAuthorized: boolean) => {
                console.log('isAuthorized: ' + isAuthorized);
            }));

        this.DataEventRecord = { id: 0, name: '', description: '', timestamp: '' };
    }

     Create() {
        // router navigate to DataEventRecordsList
        this._dataEventRecordsService
            .Add(this.DataEventRecord)
            .subscribe((data: any) => this.DataEventRecord = data,
            () => this._router.navigate(['/dataeventrecords']));
    }
}
