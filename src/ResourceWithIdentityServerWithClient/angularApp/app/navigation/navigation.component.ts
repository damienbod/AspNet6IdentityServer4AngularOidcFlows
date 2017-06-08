import { Component, OnInit } from '@angular/core';

import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { OidcSecurityUserService } from '../auth/services/oidc.security.user-service';

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit {

    hasAdminRole = false
    hasDataEventRecordsAdminRole = false;
    loaded = false;

    constructor(
        public securityService: OidcSecurityService,
        public oidcSecurityUserService: OidcSecurityUserService
    ) {
    }

    ngOnInit() {
        // TODO load the data
    }

    load() {
        this.oidcSecurityUserService.getUserData()
            .subscribe(userData => {
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

                    this.loaded = true;
                    console.log(userData);
            });
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