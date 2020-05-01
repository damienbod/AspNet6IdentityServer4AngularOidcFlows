import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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

        private dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
    ) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.userData$ = this.oidcSecurityService.userData$;

        this.isAuthenticated$.pipe(
            switchMap((isAuthorized) => this.getData(isAuthorized))
        ).subscribe(
            data => this.DataEventRecords = data,
            () => console.log('getData Get all completed')
        );
            
        this.userData$.subscribe((userData) => {
            console.log('Get userData: ', userData);
            if (userData) {
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
            }
        });
    }

    Delete(id: any) {
        console.log('Try to delete' + id);
        this.dataEventRecordsService.Delete(id).pipe(
            switchMap(() => this.getData(true))
        ).subscribe((data) => this.DataEventRecords = data,
            () => console.log('getData Get all completed')
        );
    }

    private getData(isAuthenticated: boolean): Observable<DataEventRecord[]> {
        if (isAuthenticated) {
            return this.dataEventRecordsService.GetAll();
        }
        return of(null);
    }
}
