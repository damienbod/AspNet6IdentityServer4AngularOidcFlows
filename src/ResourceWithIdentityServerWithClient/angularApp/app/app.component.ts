import {
    OidcClientNotification,
    OidcSecurityService,
} from './auth/angular-auth-oidc-client';
import { ConfigAuthenticatedResult } from './auth/authState/auth-result';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import './app.component.css';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {

    title = '';
    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean | ConfigAuthenticatedResult[]>;
    checkSessionChanged$: Observable<boolean>;
    checkSessionChanged: any;

    constructor(
        public oidcSecurityService: OidcSecurityService
    ) {
        console.log('AppComponent STARTING');
    }

    ngOnInit() {
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

        this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));
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
