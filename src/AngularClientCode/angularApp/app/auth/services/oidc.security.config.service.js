var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
var OidcConfigService = (function () {
    function OidcConfigService(httpClient) {
        this.httpClient = httpClient;
        this._onConfigurationLoaded = new Subject();
    }
    Object.defineProperty(OidcConfigService.prototype, "onConfigurationLoaded", {
        get: function () {
            return this._onConfigurationLoaded.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    OidcConfigService.prototype.load = function (configUrl) {
        var _this = this;
        this.httpClient
            .get(configUrl)
            .pipe(map(function (response) {
            _this.clientConfiguration = response;
            _this.load_using_stsServer(_this.clientConfiguration.stsServer);
        }), catchError(function (error) {
            console.error("OidcConfigService 'load' threw an error on calling " + configUrl, error);
            _this._onConfigurationLoaded.next(false);
            return of(false);
        }))
            .subscribe();
    };
    OidcConfigService.prototype.load_using_stsServer = function (stsServer) {
        var _this = this;
        var url = stsServer + "/.well-known/openid-configuration";
        this.httpClient
            .get(url)
            .pipe(map(function (response) {
            _this.wellKnownEndpoints = response;
            _this._onConfigurationLoaded.next(true);
        }), catchError(function (error) {
            console.error("OidcConfigService 'load_using_stsServer' threw an error on calling " + stsServer, error);
            _this._onConfigurationLoaded.next(false);
            return of(false);
        }))
            .subscribe();
    };
    OidcConfigService.prototype.load_using_custom_stsServer = function (url) {
        var _this = this;
        this.httpClient
            .get(url)
            .pipe(map(function (response) {
            _this.wellKnownEndpoints = response;
            _this._onConfigurationLoaded.next(true);
        }), catchError(function (error) {
            console.error("OidcConfigService 'load_using_custom_stsServer' threw an error on calling " + url, error);
            _this._onConfigurationLoaded.next(false);
            return of(false);
        }))
            .subscribe();
    };
    OidcConfigService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], OidcConfigService);
    return OidcConfigService;
}());
export { OidcConfigService };
//# sourceMappingURL=oidc.security.config.service.js.map