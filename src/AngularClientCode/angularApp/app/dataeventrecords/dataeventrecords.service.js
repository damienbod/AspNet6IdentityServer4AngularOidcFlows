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
var DataEventRecordsService = (function () {
    function DataEventRecordsService(http, configuration, _securityService) {
        var _this = this;
        this.http = http;
        this._securityService = _securityService;
        this.headers = new HttpHeaders();
        this.GetAll = function () {
            _this.setHeaders();
            return _this.http.get(_this.actionUrl, { headers: _this.headers });
        };
        this.actionUrl = configuration.Server + "api/DataEventRecords/";
    }
    DataEventRecordsService.prototype.setHeaders = function () {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');
        var token = this._securityService.getToken();
        if (token !== '') {
            var tokenValue = 'Bearer ' + token;
            this.headers = this.headers.append('Authorization', tokenValue);
        }
    };
    DataEventRecordsService.prototype.GetById = function (id) {
        this.setHeaders();
        return this.http.get(this.actionUrl + id, {
            headers: this.headers
        });
    };
    DataEventRecordsService.prototype.Add = function (itemToAdd) {
        this.setHeaders();
        return this.http.post(this.actionUrl, JSON.stringify(itemToAdd), { headers: this.headers });
    };
    DataEventRecordsService.prototype.Update = function (id, itemToUpdate) {
        this.setHeaders();
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers });
    };
    DataEventRecordsService.prototype.Delete = function (id) {
        this.setHeaders();
        return this.http.delete(this.actionUrl + id, {
            headers: this.headers
        });
    };
    DataEventRecordsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Configuration, OidcSecurityService])
    ], DataEventRecordsService);
    return DataEventRecordsService;
}());
export { DataEventRecordsService };
//# sourceMappingURL=dataeventrecords.service.js.map