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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
var SecureFileService = (function () {
    function SecureFileService(http, _configuration, oidcSecurityService) {
        var _this = this;
        this.http = http;
        this.oidcSecurityService = oidcSecurityService;
        this.headers = new HttpHeaders();
        this.GetListOfFiles = function () {
            _this.setHeaders();
            return _this.http.get(_this.fileExplorerUrl, { headers: _this.headers });
        };
        this.actionUrl = _configuration.FileServer + "api/Download/";
        this.fileExplorerUrl = _configuration.FileServer + "api/FileExplorer/";
    }
    SecureFileService.prototype.DownloadFile = function (id) {
        var _this = this;
        this.setHeaders();
        var oneTimeAccessToken = '';
        this.http.get(this.actionUrl + "GenerateOneTimeAccessToken/" + id, {
            headers: this.headers
        }).subscribe(function (data) {
            oneTimeAccessToken = data.oneTimeToken;
        }, function (error) { return _this.oidcSecurityService.handleError(error); }, function () {
            console.log("open DownloadFile for file " + id + ": " + _this.actionUrl + oneTimeAccessToken + "/" + id);
            window.open("" + _this.actionUrl + oneTimeAccessToken + "/" + id);
        });
    };
    SecureFileService.prototype.setHeaders = function () {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');
        var token = this.oidcSecurityService.getToken();
        if (token !== '') {
            var tokenValue = 'Bearer ' + token;
            this.headers = this.headers.set('Authorization', tokenValue);
        }
    };
    SecureFileService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Configuration, OidcSecurityService])
    ], SecureFileService);
    return SecureFileService;
}());
export { SecureFileService };
//# sourceMappingURL=SecureFileService.js.map