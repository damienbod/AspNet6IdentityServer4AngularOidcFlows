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
var LogoffComponent = (function () {
    function LogoffComponent(_dataEventRecordsService) {
        this._dataEventRecordsService = _dataEventRecordsService;
        this.message = "LogoffComponent constructor";
    }
    LogoffComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._dataEventRecordsService
            .GetAll()
            .subscribe(function (data) { return _this.values = data; }, function (error) { return console.log(error); }, function () { return console.log('Get all complete'); });
    };
    LogoffComponent = __decorate([
        core_1.Component({
            selector: 'logoff',
            templateUrl: 'app/logoff/logoff.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [DataEventRecordsService_1.DataEventRecordsService]
        }), 
        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService])
    ], LogoffComponent);
    return LogoffComponent;
})();
exports.LogoffComponent = LogoffComponent;
//# sourceMappingURL=logoff.component.js.map