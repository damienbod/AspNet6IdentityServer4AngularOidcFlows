import {
    EventTypes,
    OidcClientNotification,
    OidcSecurityService,
    PublicConfiguration,
    PublicEventsService,
} from './auth/angular-auth-oidc-client';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import './app.component.css';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {

    @Language() lang = '';

    title = '';
    configuration: PublicConfiguration;
    isModuleSetUp$: Observable<boolean>;
    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean>;
    checkSessionChanged$: Observable<boolean>;
    checkSessionChanged: any;

    constructor(
        public oidcSecurityService: OidcSecurityService,
        private eventService: PublicEventsService,
        public locale: LocaleService,
        public translation: TranslationService
    ) {
        console.log('AppComponent STARTING');
    }

    ngOnInit() {
        this.configuration = this.oidcSecurityService.configuration;
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.isModuleSetUp$ = this.oidcSecurityService.moduleSetup$;
        this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

        this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));

        this.eventService
            .registerForEvents()
            .pipe(filter((notification) => notification.type === EventTypes.CheckSessionReceived))
            .subscribe((value) => console.log('CheckSessionReceived with value from app', value));
    }

    changeCulture(language: string, country: string) {
        this.locale.setDefaultLocale(language, country);
        console.log('set language: ' + language);
    }

    login() {
        console.log('start login');

        let culture = 'de-CH';
        if (this.locale.getCurrentCountry()) {
            culture = this.locale.getCurrentLanguage() + '-' + this.locale.getCurrentCountry();
        }
        console.log(culture);

        // this.oidcSecurityService.setCustomRequestParameters({ 'ui_locales': culture});

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
