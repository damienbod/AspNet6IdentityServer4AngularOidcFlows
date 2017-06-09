import { Component, OnInit } from '@angular/core';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

    hasAdminRole = false
    hasDataEventRecordsAdminRole = false;

    constructor(
        public securityService: OidcSecurityService
    ) {
        this.securityService.onUserDataLoaded.subscribe(() => { this.load(); });
    }

    load() {
        let userData = this.securityService.getUserData();

        for (let i = 0; i < userData.role.length; i++) {
            if (userData.role[i] === 'dataEventRecords.admin') {
                console.log('user is dataEventRecords.admin');
                this.hasDataEventRecordsAdminRole = true;
            }
            if (userData.role[i] === 'admin') {
                console.log('user is admin');
                this.hasAdminRole = true;
            }
        }

        console.log(userData);
    }

    login() {
        console.log('Do login logic');
        this.securityService.authorize();
    }

    logout() {
        console.log('Do logout logic');
        this.securityService.logoff();
    }
}