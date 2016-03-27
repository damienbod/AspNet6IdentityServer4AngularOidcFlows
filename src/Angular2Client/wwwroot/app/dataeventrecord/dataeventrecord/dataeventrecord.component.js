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
var DataEventRecordsService_1 = require('../../services/DataEventRecordsService');
var SecurityService_1 = require('../../services/SecurityService');
var router_1 = require('angular2/router');
var DataeventrecordComponent = (function () {
    function DataeventrecordComponent(_dataEventRecordsService, securityService, _router) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this.securityService = securityService;
        this._router = _router;
        this.message = "DataeventrecordComponent DataEventRecords";
    }
    DataeventrecordComponent.prototype.ngOnInit = function () {
        this.getData();
    };
    DataeventrecordComponent.prototype.Delete = function (id) {
        var _this = this;
        console.log("Try to delete" + id);
        this._dataEventRecordsService.Delete(id)
            .subscribe((function () { return console.log("subscribed"); }), function (error) { return _this.securityService.HandleError(error); }, function () { return _this.getData(); });
    };
    DataeventrecordComponent.prototype.getData = function () {
        var _this = this;
        this._dataEventRecordsService
            .GetAll()
            .subscribe(function (data) { return _this.DataEventRecords = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('Get all completed'); });
    };
    DataeventrecordComponent = __decorate([
        core_1.Component({
            selector: 'dataeventrecord',
            templateUrl: 'app/dataeventrecord/dataeventrecord/dataeventrecord.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [DataEventRecordsService_1.DataEventRecordsService]
        }), 
        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, SecurityService_1.SecurityService, router_1.Router])
    ], DataeventrecordComponent);
    return DataeventrecordComponent;
})();
exports.DataeventrecordComponent = DataeventrecordComponent;
//# sourceMappingURL=dataeventrecord.component.js.map