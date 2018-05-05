import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { OidcSecurityService } from './auth/services/oidc.security.service';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(public oidcSecurityService: OidcSecurityService) {
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }

    login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    logout() {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    }
}
