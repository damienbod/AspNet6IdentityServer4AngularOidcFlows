var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
var OidcDataService = (function () {
    function OidcDataService(httpClient) {
        this.httpClient = httpClient;
    }
    OidcDataService.prototype.getWellknownEndpoints = function (url) {
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    OidcDataService.prototype.getIdentityUserData = function (url, token) {
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    OidcDataService.prototype.get = function (url) {
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    OidcDataService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], OidcDataService);
    return OidcDataService;
}());
export { OidcDataService };
//# sourceMappingURL=oidc-data.service.js.map