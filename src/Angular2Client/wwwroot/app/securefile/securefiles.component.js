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
var common_1 = require('angular2/common');
var SecureFileService_1 = require('./SecureFileService');
var SecurityService_1 = require('../services/SecurityService');
var router_1 = require('angular2/router');
var SecureFilesComponent = (function () {
    function SecureFilesComponent(_secureFileService, securityService, _router) {
        this._secureFileService = _secureFileService;
        this.securityService = securityService;
        this._router = _router;
        this.message = "Secure Files download";
    }
    SecureFilesComponent.prototype.ngOnInit = function () {
        this.getData();
    };
    SecureFilesComponent.prototype.GetFileById = function (id) {
        window.open(this._secureFileService.GetDownloadfileUrl(id));
    };
    SecureFilesComponent.prototype.getData = function () {
        var _this = this;
        this._secureFileService.GetListOfFiles()
            .subscribe(function (data) { return _this.Files = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('Get all completed'); });
    };
    SecureFilesComponent = __decorate([
        core_1.Component({
            selector: 'securefiles',
            templateUrl: 'app/securefile/securefiles.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [SecureFileService_1.SecureFileService]
        }), 
        __metadata('design:paramtypes', [SecureFileService_1.SecureFileService, SecurityService_1.SecurityService, router_1.Router])
    ], SecureFilesComponent);
    return SecureFilesComponent;
})();
exports.SecureFilesComponent = SecureFilesComponent;
//# sourceMappingURL=securefiles.component.js.map