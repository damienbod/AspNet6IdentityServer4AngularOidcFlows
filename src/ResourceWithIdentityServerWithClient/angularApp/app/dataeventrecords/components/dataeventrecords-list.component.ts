import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OidcSecurityService } from '../../auth/services/oidc.security.service';

import { DataEventRecordsService } from '../dataeventrecords.service';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
    selector: 'app-dataeventrecords-list',
    templateUrl: 'dataeventrecords-list.component.html'
})

export class DataEventRecordsListComponent implements OnInit, OnDestroy {

    message: string;
    DataEventRecords: DataEventRecord[] = [];
    hasAdminRole = false;
    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    userDataSubscription: Subscription | undefined;
    userData = false;

    constructor(

        private _dataEventRecordsService: DataEventRecordsService,
        public oidcSecurityService: OidcSecurityService,
    ) {
        this.message = 'DataEventRecords';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;

                if (this.isAuthorized) {
                    console.log('isAuthorized getting data');
                    this.getData();
                }
            });

        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {

                if (userData !== '') {
                    for (let i = 0; i < userData.role.length; i++) {
                        if (userData.role[i] === 'dataEventRecords.admin') {
                            this.hasAdminRole = true;
                        }
                        if (userData.role[i] === 'admin') {
                        }
                    }
                }

                console.log('userData getting data');
            });
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }

        if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
        }
    }

    public Delete(id: any) {
        console.log('Try to delete' + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((() => console.log('subscribed')),
            error => this.oidcSecurityService.handleError(error),
            () => this.getData());
    }

    private getData() {
        this._dataEventRecordsService
            .GetAll()
            .subscribe(data => this.DataEventRecords = data,
            error => this.oidcSecurityService.handleError(error),
            () => console.log('getData Get all completed'));
    }


}
