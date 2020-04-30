import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OidcSecurityService } from '../../auth/angular-auth-oidc-client';

import { DataEventRecordsService } from '../dataeventrecords.service';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
    selector: 'app-dataeventrecords-list',
    templateUrl: 'dataeventrecords-list.component.html'
})

export class DataEventRecordsListComponent implements OnInit {

    message: string;
    DataEventRecords: DataEventRecord[] = [];
    hasAdminRole = false;
    isAuthenticated$: Observable<boolean>;
    userData$: Observable<any>;

    constructor(

        private _dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
    ) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.userData$ = this.oidcSecurityService.userData$;

        this.isAuthenticated$.pipe(
            map((isAuthorized: boolean) => {
                console.log('isAuthorized: ' + isAuthorized);

                if (isAuthorized) {
                    this.getData();
                }
            }));
            
        this.userData$.pipe(
            map((userData: any) => {
                console.log('userData: ', userData);

                if (userData !== '') {
                    for (let i = 0; i < userData.role.length; i++) {
                        if (userData.role[i] === 'dataEventRecords.admin') {
                            this.hasAdminRole = true;
                        }
                        if (userData.role[i] === 'admin') {
                        }
                    }
                }
            }));
    }

    Delete(id: any) {
        console.log('Try to delete' + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((() => console.log('subscribed')),
            () => this.getData());
    }

    private getData() {
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            () => console.log('getData Get all completed'));
    }


}
