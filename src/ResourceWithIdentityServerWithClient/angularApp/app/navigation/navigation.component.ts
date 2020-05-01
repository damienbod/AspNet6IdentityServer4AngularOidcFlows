import {
    //EventTypes,
    OidcClientNotification,
    OidcSecurityService,
    PublicConfiguration,
    // PublicEventsService,
} from '../auth/angular-auth-oidc-client';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit {

    hasAdminRole = false;
    hasDataEventRecordsAdminRole = false;

    configuration: PublicConfiguration;
    isModuleSetUp$: Observable<boolean>;
    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean>;
    checkSessionChanged$: Observable<boolean>;
    checkSessionChanged: any;

    constructor(public oidcSecurityService: OidcSecurityService) {
        console.log('AppComponent STARTING');
    }

    ngOnInit() {
        this.configuration = this.oidcSecurityService.configuration;
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.isModuleSetUp$ = this.oidcSecurityService.moduleSetup$;
        this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

        this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));

        this.userData$.subscribe((userData) => {
            console.log('Get userData: ', userData);
            if (userData && userData.role) {
                for (let i = 0; i < userData.role.length; i++) {
                    if (userData.role[i] === 'dataEventRecords.admin') {
                        this.hasDataEventRecordsAdminRole = true;
                    }
                    if (userData.role[i] === 'admin') {
                        this.hasAdminRole = true;
                    }
                }
            }
        });
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
