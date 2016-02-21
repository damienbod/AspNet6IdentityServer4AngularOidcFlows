var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
require('rxjs/add/operator/map');
var app_constants_1 = require('../app.constants');
var router_1 = require('angular2/router');
var SecurityService = (function () {
    function SecurityService(_http, _configuration, _router) {
        this._http = _http;
        this._configuration = _configuration;
        this._router = _router;
        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = localStorage;
    }
    SecurityService.prototype.ResetAuthorizationData = function () {
        this.store("authorizationData", "");
        this.IsAuthorized = false;
        this.HasAdminRole = false;
    };
    SecurityService.prototype.SetAuthorizationData = function (token) {
        if (this.retrieve("authorizationData") !== "") {
            this.store("authorizationData", "");
        }
        this.store("authorizationData", token);
        this.IsAuthorized = true;
        var data = this.getDataFromToken(token);
        for (var i = 0; i < data.role.length; i++) {
            if (data.role[i] === "dataEventRecords.admin") {
                this.HasAdminRole = true;
            }
        }
    };
    SecurityService.prototype.Authorize = function () {
        this.ResetAuthorizationData();
        console.log("BEGIN Authorize, no auth data");
        if (window.location.hash) {
            console.log("AuthorizedController created, has hash");
            var hash = window.location.hash.substr(1);
            var result = hash.split('&').reduce(function (result, item) {
                var parts = item.split('=');
                result[parts[0]] = parts[1];
                return result;
            }, {});
            var token = "";
            if (!result.error) {
                if (result.state !== this.retrieve("authStateControl")) {
                    console.log("AuthorizedController created. no myautostate");
                }
                else {
                    this.store("authStateControl", "");
                    console.log("AuthorizedController created. returning access token");
                    console.log(result);
                    token = result.access_token;
                    var data = this.getDataFromToken(token);
                    console.log(data);
                }
            }
            this.SetAuthorizationData(token);
            console.log(this.retrieve("authorizationData"));
            this._router.navigate(['Overviewindex']);
        }
        else {
            console.log("AuthorizedController time to log on");
            var authorizationUrl = 'https://localhost:44345/connect/authorize';
            var client_id = 'angular2client';
            var redirect_uri = 'https://localhost:44311/authorized';
            var response_type = "token";
            var scope = "dataEventRecords aReallyCoolScope";
            var state = Date.now() + "" + Math.random();
            this.store("authStateControl", state);
            console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));
            var url = authorizationUrl + "?" +
                "client_id=" + encodeURI(client_id) + "&" +
                "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                "response_type=" + encodeURI(response_type) + "&" +
                "scope=" + encodeURI(scope) + "&" +
                "state=" + encodeURI(state);
            window.location.href = url;
        }
    };
    SecurityService.prototype.Logoff = function () {
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
    SecurityService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration, router_1.Router])
    ], SecurityService);
    return SecurityService;
})();
exports.SecurityService = SecurityService;
//# sourceMappingURL=SecurityService.js.map