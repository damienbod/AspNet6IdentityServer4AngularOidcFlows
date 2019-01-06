var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OidcDataService } from '../data-services/oidc-data.service';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
var OidcSecurityUserService = (function () {
    function OidcSecurityUserService(oidcDataService, oidcSecurityCommon, loggerService) {
        this.oidcDataService = oidcDataService;
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.userData = '';
    }
    OidcSecurityUserService.prototype.setupModule = function (authWellKnownEndpoints) {
        this.authWellKnownEndpoints = Object.assign({}, authWellKnownEndpoints);
    };
    OidcSecurityUserService.prototype.initUserData = function () {
        var _this = this;
        return this.getIdentityUserData().pipe(map(function (data) { return (_this.userData = data); }));
    };
    OidcSecurityUserService.prototype.getUserData = function () {
        if (!this.userData) {
            throw Error('UserData is not set!');
        }
        return this.userData;
    };
    OidcSecurityUserService.prototype.setUserData = function (value) {
        this.userData = value;
    };
    OidcSecurityUserService.prototype.getIdentityUserData = function () {
        var token = this.oidcSecurityCommon.getAccessToken();
        if (!this.authWellKnownEndpoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
            throw Error('authWellKnownEndpoints is undefined');
        }
        var canGetUserData = this.authWellKnownEndpoints && this.authWellKnownEndpoints.userinfo_endpoint;
        if (!canGetUserData) {
            this.loggerService.logError('init check session: authWellKnownEndpoints.userinfo_endpoint is undefined; set auto_userinfo = false in config');
            throw Error('authWellKnownEndpoints.userinfo_endpoint is undefined');
        }
        return this.oidcDataService.getIdentityUserData(this.authWellKnownEndpoints.userinfo_endpoint, token);
    };
    OidcSecurityUserService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [OidcDataService, OidcSecurityCommon, LoggerService])
    ], OidcSecurityUserService);
    return OidcSecurityUserService;
}());
export { OidcSecurityUserService };
//# sourceMappingURL=oidc.security.user-service.js.map