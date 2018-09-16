import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OidcSecurityService } from './auth/services/oidc.security.service';

import './app.component.css';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(public securityService: OidcSecurityService) {
        if (this.securityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.securityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.securityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }

    login() {
        console.log('start login');
        this.securityService.authorize();
    }

    private doCallbackLogicIfRequired() {
        if (window.location.hash) {
            this.securityService.authorizedCallback();
        }
    }

    refreshSession() {
        console.log('start refreshSession');
        this.securityService.authorize();
    }

    logout() {
        console.log('start logoff');
        this.securityService.logoff();
    }
}
