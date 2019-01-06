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
import { Router } from '@angular/router';
import { OidcSecurityService } from '../../auth/services/oidc.security.service';
import { DataEventRecordsService } from '../dataeventrecords.service';
var DataEventRecordsCreateComponent = (function () {
    function DataEventRecordsCreateComponent(_dataEventRecordsService, oidcSecurityService, _router) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this.oidcSecurityService = oidcSecurityService;
        this._router = _router;
        this.isAuthorized = false;
        this.message = 'DataEventRecords Create';
    }
    DataEventRecordsCreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(function (isAuthorized) {
            _this.isAuthorized = isAuthorized;
        });
        this.DataEventRecord = { Id: 0, Name: '', Description: '' };
        console.log('IsAuthorized:' + this.isAuthorized);
    };
    DataEventRecordsCreateComponent.prototype.ngOnDestroy = function () {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    };
    DataEventRecordsCreateComponent.prototype.Create = function () {
        var _this = this;
        this._dataEventRecordsService
            .Add(this.DataEventRecord)
            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return _this._router.navigate(['/dataeventrecords']); });
    };
    DataEventRecordsCreateComponent = __decorate([
        Component({
            selector: 'app-dataeventrecords-create',
            templateUrl: 'dataeventrecords-create.component.html'
        }),
        __metadata("design:paramtypes", [DataEventRecordsService,
            OidcSecurityService,
            Router])
    ], DataEventRecordsCreateComponent);
    return DataEventRecordsCreateComponent;
}());
export { DataEventRecordsCreateComponent };
//# sourceMappingURL=dataeventrecords-create.component.js.map