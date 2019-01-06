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
import { OidcSecurityService } from '../../auth/services/oidc.security.service';
import { DataEventRecordsService } from '../dataeventrecords.service';
var DataEventRecordsListComponent = (function () {
    function DataEventRecordsListComponent(_dataEventRecordsService, oidcSecurityService) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this.oidcSecurityService = oidcSecurityService;
        this.DataEventRecords = [];
        this.hasAdminRole = false;
        this.isAuthorized = false;
        this.userData = false;
        this.message = 'DataEventRecords';
    }
    DataEventRecordsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(function (isAuthorized) {
            _this.isAuthorized = isAuthorized;
            if (_this.isAuthorized) {
                console.log('isAuthorized getting data');
                _this.getData();
            }
        });
        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(function (userData) {
            if (userData !== '') {
                for (var i = 0; i < userData.role.length; i++) {
                    if (userData.role[i] === 'dataEventRecords.admin') {
                        _this.hasAdminRole = true;
                    }
                    if (userData.role[i] === 'admin') {
                    }
                }
            }
            console.log('userData getting data');
        });
    };
    DataEventRecordsListComponent.prototype.ngOnDestroy = function () {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
        if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
        }
    };
    DataEventRecordsListComponent.prototype.Delete = function (id) {
        var _this = this;
        console.log('Try to delete' + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((function () { return console.log('subscribed'); }), function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return _this.getData(); });
    };
    DataEventRecordsListComponent.prototype.getData = function () {
        var _this = this;
        this._dataEventRecordsService
            .GetAll()
            .subscribe(function (data) { return _this.DataEventRecords = data; }, function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return console.log('getData Get all completed'); });
    };
    DataEventRecordsListComponent = __decorate([
        Component({
            selector: 'app-dataeventrecords-list',
            templateUrl: 'dataeventrecords-list.component.html'
        }),
        __metadata("design:paramtypes", [DataEventRecordsService,
            OidcSecurityService])
    ], DataEventRecordsListComponent);
    return DataEventRecordsListComponent;
}());
export { DataEventRecordsListComponent };
//# sourceMappingURL=dataeventrecords-list.component.js.map