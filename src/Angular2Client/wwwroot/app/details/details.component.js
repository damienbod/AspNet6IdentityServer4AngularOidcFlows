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
var DataEventRecordsService_1 = require('../services/DataEventRecordsService');
var router_1 = require('angular2/router');
var SecurityService_1 = require('../services/SecurityService');
var DetailsComponent = (function () {
    function DetailsComponent(_dataEventRecordsService, _routeParams, securityService) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this._routeParams = _routeParams;
        this.securityService = securityService;
        this.message = "DetailsComponent constructor";
        this.Id = this._routeParams.get('Id');
    }
    DetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
        this._dataEventRecordsService.GetById(this.Id)
            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return console.log(error); }, function () { return console.log('Get by Id complete'); });
    };
    DetailsComponent.prototype.Update = function () {
        var _this = this;
        this._dataEventRecordsService.Update(this.Id, this.DataEventRecord)
            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return console.log(error); }, function () { return console.log('Update complete'); });
    };
    DetailsComponent = __decorate([
        core_1.Component({
            selector: 'details',
            templateUrl: 'app/details/details.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [DataEventRecordsService_1.DataEventRecordsService]
        }), 
        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, router_1.RouteParams, SecurityService_1.SecurityService])
    ], DetailsComponent);
    return DetailsComponent;
})();
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=details.component.js.map