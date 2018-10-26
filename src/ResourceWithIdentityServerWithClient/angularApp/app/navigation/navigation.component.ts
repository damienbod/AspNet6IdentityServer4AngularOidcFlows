import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit, OnDestroy {

    hasAdminRole = false;
    hasDataEventRecordsAdminRole = false;

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    userDataSubscription: Subscription | undefined;
    userData: any;

    constructor(public oidcSecurityService: OidcSecurityService) {
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;

                if (this.isAuthorized) {
                    console.log('isAuthorized getting data');
                }
            });

        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {

                if (userData && userData !== '' && userData.role) {
                    for (let i = 0; i < userData.role.length; i++) {
                        if (userData.role[i] === 'dataEventRecords.admin') {
                            this.hasDataEventRecordsAdminRole = true;
                        }
                        if (userData.role[i] === 'admin') {
                            this.hasAdminRole = true;
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

    login() {
        console.log('Do login logic');
        this.oidcSecurityService.authorize();
    }

    logout() {
        console.log('Do logout logic');
        this.oidcSecurityService.logoff();
    }
}
