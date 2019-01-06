var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import './app.component.css';
import { AuthorizationState } from './auth/models/authorization-state.enum';
var AppComponent = (function () {
    function AppComponent(oidcSecurityService, locale, router, translation) {
        var _this = this;
        this.oidcSecurityService = oidcSecurityService;
        this.locale = locale;
        this.router = router;
        this.translation = translation;
        this.lang = '';
        this.title = '';
        this.isAuthorized = false;
        this.checksession = false;
        console.log('AppComponent STARTING');
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        }
        else {
            this.oidcSecurityService.onModuleSetup.subscribe(function () {
                _this.doCallbackLogicIfRequired();
            });
        }
        this.oidcSecurityService.onCheckSessionChanged.subscribe(function (checksession) {
            console.log('...recieved a check session event');
            _this.checksession = checksession;
        });
        this.oidcSecurityService.onAuthorizationResult.subscribe(function (authorizationResult) {
            _this.onAuthorizationResultComplete(authorizationResult);
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(function (isAuthorized) {
            _this.isAuthorized = isAuthorized;
        });
    };
    AppComponent.prototype.changeCulture = function (language, country) {
        this.locale.setDefaultLocale(language, country);
        console.log('set language: ' + language);
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    };
    AppComponent.prototype.login = function () {
        console.log('start login');
        var culture = 'de-CH';
        if (this.locale.getCurrentCountry()) {
            culture = this.locale.getCurrentLanguage() + '-' + this.locale.getCurrentCountry();
        }
        this.oidcSecurityService.setCustomRequestParameters({ 'ui_locales': culture });
        this.oidcSecurityService.authorizeCodeFlow();
    };
    AppComponent.prototype.refreshSession = function () {
        console.log('start refreshSession');
        this.oidcSecurityService.authorizeCodeFlow();
    };
    AppComponent.prototype.logout = function () {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    };
    AppComponent.prototype.doCallbackLogicIfRequired = function () {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedImplicitFlowCallback();
        }
    };
    AppComponent.prototype.onAuthorizationResultComplete = function (authorizationResult) {
        console.log('Auth result received AuthorizationState:'
            + authorizationResult.authorizationState
            + ' validationResult:' + authorizationResult.validationResult);
        if (authorizationResult.authorizationState === AuthorizationState.unauthorized) {
            if (window.parent) {
                this.router.navigate(['/unauthorized']);
            }
            else {
                window.location.href = '/unauthorized';
            }
        }
    };
    __decorate([
        Language(),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "lang", void 0);
    AppComponent = __decorate([
        Component({
            selector: 'app-component',
            templateUrl: 'app.component.html',
        }),
        __metadata("design:paramtypes", [OidcSecurityService,
            LocaleService,
            Router,
            TranslationService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map