import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { LocaleService, TranslationService, Language } from 'angular-l10n';

import './app.component.css';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {

    @Language() lang: string;

    title: string;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(
        public oidcSecurityService: OidcSecurityService,
        public locale: LocaleService,
        public translation: TranslationService
    ) {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        this.translation.translationChanged().subscribe(
            () => { this.title = this.translation.translate('Title'); }
        );
    }

    changeCulture(language: string, country: string) {
        this.locale.setDefaultLocale(language, country);
        console.log('set language: ' + language);
    }


    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
        this.oidcSecurityService.onModuleSetup.unsubscribe();
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

    private doCallbackLogicIfRequired() {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }
}
