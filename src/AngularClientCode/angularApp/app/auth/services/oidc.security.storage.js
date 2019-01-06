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
import { AuthConfiguration } from '../modules/auth.configuration';
var OidcSecurityStorage = (function () {
    function OidcSecurityStorage() {
    }
    OidcSecurityStorage = __decorate([
        Injectable()
    ], OidcSecurityStorage);
    return OidcSecurityStorage;
}());
export { OidcSecurityStorage };
var BrowserStorage = (function () {
    function BrowserStorage(authConfiguration) {
        this.authConfiguration = authConfiguration;
        this.hasStorage = typeof Storage !== 'undefined';
    }
    BrowserStorage.prototype.read = function (key) {
        if (this.hasStorage) {
            return JSON.parse(this.authConfiguration.storage.getItem(key + '_' + this.authConfiguration.client_id));
        }
        return;
    };
    BrowserStorage.prototype.write = function (key, value) {
        if (this.hasStorage) {
            value = value === undefined ? null : value;
            this.authConfiguration.storage.setItem(key + '_' + this.authConfiguration.client_id, JSON.stringify(value));
        }
    };
    BrowserStorage = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthConfiguration])
    ], BrowserStorage);
    return BrowserStorage;
}());
export { BrowserStorage };
//# sourceMappingURL=oidc.security.storage.js.map