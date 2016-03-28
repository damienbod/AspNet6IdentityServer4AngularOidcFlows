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
var router_1 = require('angular2/router');
var SecurityService_1 = require('../services/SecurityService');
var DataEventRecordsService_1 = require('../dataeventrecords/DataEventRecordsService');
var DataEventRecordsEditComponent = (function () {
    function DataEventRecordsEditComponent(_dataEventRecordsService, _routeParams, securityService, _router) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this._routeParams = _routeParams;
        this.securityService = securityService;
        this._router = _router;
        this.message = "DataEventRecordsEditComponent constructor";
        this.id = +this._routeParams.get('Id');
        this.DataEventRecord = { Id: this.id, Name: "", Description: "", Timestamp: "" };
    }
    DataEventRecordsEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
        this._dataEventRecordsService.GetById(this.id)
            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('DetailsComponent:Get by Id complete'); });
    };
    DataEventRecordsEditComponent.prototype.Update = function () {
        var _this = this;
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((function () { return console.log("subscribed"); }), function (error) { return _this.securityService.HandleError(error); }, function () { return _this._router.navigate(['DataEventRecords']); });
    };
    DataEventRecordsEditComponent = __decorate([
        core_1.Component({
            selector: 'dataeventrecords-edit',
            templateUrl: 'app/dataeventrecords/dataeventrecords-edit.component.html',
            directives: [common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, router_1.RouteParams, SecurityService_1.SecurityService, router_1.Router])
    ], DataEventRecordsEditComponent);
    return DataEventRecordsEditComponent;
})();
exports.DataEventRecordsEditComponent = DataEventRecordsEditComponent;
//# sourceMappingURL=dataeventrecords-edit.component.js.map