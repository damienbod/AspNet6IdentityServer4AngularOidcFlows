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
import { Router, ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from '../../auth/services/oidc.security.service';
import { DataEventRecordsService } from '../dataeventrecords.service';
var DataEventRecordsEditComponent = (function () {
    function DataEventRecordsEditComponent(_dataEventRecordsService, oidcSecurityService, _route, _router) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this.oidcSecurityService = oidcSecurityService;
        this._route = _route;
        this._router = _router;
        this.id = 0;
        this.DataEventRecord = {
            Id: 0,
            Name: '',
            Description: '',
            Timestamp: ''
        };
        this.isAuthorized = false;
        this.message = 'DataEventRecords Edit';
    }
    DataEventRecordsEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(function (isAuthorized) {
            _this.isAuthorized = isAuthorized;
        });
        console.log('IsAuthorized:' + this.isAuthorized);
        this.sub = this._route.params.subscribe(function (params) {
            var id = +params['id'];
            _this.id = id;
            if (_this.DataEventRecord.Id === 0) {
                _this._dataEventRecordsService.GetById(id)
                    .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return console.log('DataEventRecordsEditComponent:Get by Id complete'); });
            }
        });
    };
    DataEventRecordsEditComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    };
    DataEventRecordsEditComponent.prototype.Update = function () {
        var _this = this;
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((function () { return console.log('subscribed'); }), function (error) { return _this.oidcSecurityService.handleError(error); }, function () { return _this._router.navigate(['/dataeventrecords']); });
    };
    DataEventRecordsEditComponent = __decorate([
        Component({
            selector: 'app-dataeventrecords-edit',
            templateUrl: 'dataeventrecords-edit.component.html'
        }),
        __metadata("design:paramtypes", [DataEventRecordsService,
            OidcSecurityService,
            ActivatedRoute,
            Router])
    ], DataEventRecordsEditComponent);
    return DataEventRecordsEditComponent;
}());
export { DataEventRecordsEditComponent };
//# sourceMappingURL=dataeventrecords-edit.component.js.map