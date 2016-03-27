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
var SecurityService_1 = require('../services/SecurityService');
var SecureFileService = (function () {
    function SecureFileService(_http, _configuration, _securityService) {
        var _this = this;
        this._http = _http;
        this._configuration = _configuration;
        this._securityService = _securityService;
        this.GetListOfFiles = function () {
            var token = _this._securityService.GetToken();
            return _this._http.get(_this.fileExplorerUrl + "?access_token=" + token, {}).map(function (res) { return res.json(); });
        };
        this.actionUrl = _configuration.FileServer + 'api/Download/';
        this.fileExplorerUrl = _configuration.FileServer + 'api/FileExplorer/';
    }
    SecureFileService.prototype.GetDownloadfileUrl = function (id) {
        var token = this._securityService.GetToken();
        return "" + this.actionUrl + id + "?access_token=" + token;
    };
    SecureFileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration, SecurityService_1.SecurityService])
    ], SecureFileService);
    return SecureFileService;
})();
exports.SecureFileService = SecureFileService;
//# sourceMappingURL=SecureFileService.js.map