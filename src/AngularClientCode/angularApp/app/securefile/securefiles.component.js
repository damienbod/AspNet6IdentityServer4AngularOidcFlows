var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { SecureFileService } from './SecureFileService';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
var SecureFilesComponent = (function () {
    function SecureFilesComponent(_secureFileService, oidcSecurityService) {
        this._secureFileService = _secureFileService;
        this.oidcSecurityService = oidcSecurityService;
        this.Files = [];
        this.isAuthorized = false;
        this.message = 'Secure Files download';
    }
    SecureFilesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(function (isAuthorized) {
            _this.isAuthorized = isAuthorized;
            if (isAuthorized) {
                _this.getData();
            }
        });
    };
    SecureFilesComponent.prototype.ngOnDestroy = function () {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    };
    SecureFilesComponent.prototype.DownloadFileById = function (id) {
        this._secureFileService.DownloadFile(id);
    };
    SecureFilesComponent.prototype.getData = function () {
        var _this = this;
        this._secureFileService.GetListOfFiles()
            .subscribe(function (data) { return _this.Files = data; }, function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return console.log('getData for secure files, get all completed'); });
    };
    SecureFilesComponent = __decorate([
        Component({
            selector: 'app-securefiles',
            templateUrl: 'securefiles.component.html',
            providers: [SecureFileService]
        }),
        __metadata("design:paramtypes", [SecureFileService, OidcSecurityService])
    ], SecureFilesComponent);
    return SecureFilesComponent;
}());
export { SecureFilesComponent };
//# sourceMappingURL=securefiles.component.js.map