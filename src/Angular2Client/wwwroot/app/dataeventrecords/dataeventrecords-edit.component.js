System.register(['@angular/core', '@angular/common', '@angular/router', '../services/SecurityService', '../dataeventrecords/DataEventRecordsService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, SecurityService_1, DataEventRecordsService_1;
    var DataEventRecordsEditComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (SecurityService_1_1) {
                SecurityService_1 = SecurityService_1_1;
            },
            function (DataEventRecordsService_1_1) {
                DataEventRecordsService_1 = DataEventRecordsService_1_1;
            }],
        execute: function() {
            DataEventRecordsEditComponent = (function () {
                function DataEventRecordsEditComponent(_dataEventRecordsService, _routeParams, securityService, _router) {
                    this._dataEventRecordsService = _dataEventRecordsService;
                    this._routeParams = _routeParams;
                    this.securityService = securityService;
                    this._router = _router;
                    this.message = "DataEventRecords Edit";
                    this.id = +this._routeParams.get('id');
                }
                DataEventRecordsEditComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    console.log("IsAuthorized:" + this.securityService.IsAuthorized);
                    console.log("HasAdminRole:" + this.securityService.HasAdminRole);
                    var id = +this._routeParams.get('id');
                    if (!this.DataEventRecord) {
                        this._dataEventRecordsService.GetById(id)
                            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('DataEventRecordsEditComponent:Get by Id complete'); });
                    }
                };
                DataEventRecordsEditComponent.prototype.Update = function () {
                    var _this = this;
                    this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
                        .subscribe((function () { return console.log("subscribed"); }), function (error) { return _this.securityService.HandleError(error); }, function () { return _this._router.navigate(['DataEventRecordsList']); });
                };
                DataEventRecordsEditComponent = __decorate([
                    core_1.Component({
                        selector: 'dataeventrecords-edit',
                        templateUrl: 'app/dataeventrecords/dataeventrecords-edit.component.html',
                        directives: [common_1.CORE_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, (typeof (_a = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _a) || Object, SecurityService_1.SecurityService, router_1.Router])
                ], DataEventRecordsEditComponent);
                return DataEventRecordsEditComponent;
                var _a;
            }());
            exports_1("DataEventRecordsEditComponent", DataEventRecordsEditComponent);
        }
    }
});
//# sourceMappingURL=dataeventrecords-edit.component.js.map