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
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Configuration } from '../app.constants';
import { Router } from '@angular/router';
export var SecurityService = (function () {
    function SecurityService(_http, _configuration, _router) {
        var _this = this;
        this._http = _http;
        this._configuration = _configuration;
        this._router = _router;
        this.getUserData = function () {
            _this.setHeaders();
            return _this._http.get(_this._configuration.Server + '/connect/userinfo', {
                headers: _this.headers,
                body: ''
            }).map(function (res) { return res.json(); });
        };
        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = sessionStorage;
        if (this.retrieve('IsAuthorized') !== '') {
            this.HasAdminRole = this.retrieve('HasAdminRole');
            this.IsAuthorized = this.retrieve('IsAuthorized');
            this.HasUserAdminRole = this.retrieve('HasUserAdminRole');
        }
    }
    SecurityService.prototype.GetToken = function () {
        return this.retrieve('authorizationData');
    };
    SecurityService.prototype.ResetAuthorizationData = function () {
        this.store('authorizationData', '');
        this.store('authorizationDataIdToken', '');
        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.HasUserAdminRole = false;
        this.store('HasAdminRole', false);
        this.store('HasUserAdminRole', false);
        this.store('IsAuthorized', false);
    };
    SecurityService.prototype.SetAuthorizationData = function (token, id_token) {
        var _this = this;
        if (this.retrieve('authorizationData') !== '') {
            this.store('authorizationData', '');
        }
        console.log(token);
        console.log(id_token);
        console.log('storing to storage, getting the roles');
        this.store('authorizationData', token);
        this.store('authorizationDataIdToken', id_token);
        this.IsAuthorized = true;
        this.store('IsAuthorized', true);
        this.getUserData()
            .subscribe(function (data) { return _this.UserData = data; }, function (error) { return _this.HandleError(error); }, function () {
            for (var i = 0; i < _this.UserData.role.length; i++) {
                console.log('Role: ' + _this.UserData.role[i]);
                if (_this.UserData.role[i] === 'dataEventRecords.admin') {
                    _this.HasAdminRole = true;
                    _this.store('HasAdminRole', true);
                }
                if (_this.UserData.role[i] === 'admin') {
                    _this.HasUserAdminRole = true;
                    _this.store('HasUserAdminRole', true);
                }
            }
        });
    };
    SecurityService.prototype.Authorize = function () {
        this.ResetAuthorizationData();
        console.log('BEGIN Authorize, no auth data');
        var authorizationUrl = this._configuration.Server + '/connect/authorize';
        var client_id = 'singleapp';
        var redirect_uri = this._configuration.Server;
        var response_type = 'id_token token';
        var scope = 'dataEventRecords openid';
        var nonce = 'N' + Math.random() + '' + Date.now();
        var state = Date.now() + '' + Math.random();
        this.store('authStateControl', state);
        this.store('authNonce', nonce);
        console.log('AuthorizedController created. adding myautostate: ' + this.retrieve('authStateControl'));
        var url = authorizationUrl + '?' +
            'response_type=' + encodeURI(response_type) + '&' +
            'client_id=' + encodeURI(client_id) + '&' +
            'redirect_uri=' + encodeURI(redirect_uri) + '&' +
            'scope=' + encodeURI(scope) + '&' +
            'nonce=' + encodeURI(nonce) + '&' +
            'state=' + encodeURI(state);
        window.location.href = url;
    };
    SecurityService.prototype.AuthorizedCallback = function () {
        console.log('BEGIN AuthorizedCallback, no auth data');
        this.ResetAuthorizationData();
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
        console.log(result);
        console.log('AuthorizedCallback created, begin token validation');
        var token = '';
        var id_token = '';
        var authResponseIsValid = false;
        if (!result.error) {
            if (result.state !== this.retrieve('authStateControl')) {
                console.log('AuthorizedCallback incorrect state');
            }
            else {
                token = result.access_token;
                id_token = result.id_token;
                var dataIdToken = this.getDataFromToken(id_token);
                console.log(dataIdToken);
                if (dataIdToken.nonce !== this.retrieve('authNonce')) {
                    console.log('AuthorizedCallback incorrect nonce');
                }
                else {
                    this.store('authNonce', '');
                    this.store('authStateControl', '');
                    authResponseIsValid = true;
                    console.log('SSSS:authResponseIsValid:' + authResponseIsValid);
                    console.log('AuthorizedCallback state and nonce validated, returning access token');
                }
            }
        }
        console.log('SSSS:authResponseIsValid:' + authResponseIsValid);
        if (authResponseIsValid) {
            this.SetAuthorizationData(token, id_token);
            console.log(this.retrieve('authorizationData'));
            this._router.navigate(['/dataeventrecords/list']);
        }
        else {
            this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
    };
    SecurityService.prototype.Logoff = function () {
        console.log('BEGIN Authorize, no auth data');
        var authorizationUrl = this._configuration.Server + '/connect/endsession';
        var id_token_hint = this.retrieve('authorizationDataIdToken');
        var post_logout_redirect_uri = this._configuration.Server + '/Unauthorized';
        var url = authorizationUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);
        this.ResetAuthorizationData();
        window.location.href = url;
    };
    SecurityService.prototype.HandleError = function (error) {
        console.log(error);
        if (error.status == 403) {
            this._router.navigate(['/Forbidden']);
        }
        else if (error.status == 401) {
            this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
    };
    SecurityService.prototype.urlBase64Decode = function (str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };
    SecurityService.prototype.getDataFromToken = function (token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }
        return data;
    };
    SecurityService.prototype.retrieve = function (key) {
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }
        return;
    };
    SecurityService.prototype.store = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };
    SecurityService.prototype.setHeaders = function () {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        var token = this.GetToken();
        if (token !== '') {
            this.headers.append('Authorization', 'Bearer ' + token);
        }
    };
    SecurityService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, Configuration, Router])
    ], SecurityService);
    return SecurityService;
}());
