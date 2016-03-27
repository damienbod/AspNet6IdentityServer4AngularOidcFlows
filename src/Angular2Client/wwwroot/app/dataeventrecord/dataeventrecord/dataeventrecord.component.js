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
var dataeventrecords_component_1 = require('../../dataeventrecord/dataeventrecords/dataeventrecords.component');
var dataeventrecordcreate_component_1 = require('../../dataeventrecord/dataeventrecordcreate/dataeventrecordcreate.component');
var dataeventrecordedit_component_1 = require('../../dataeventrecord/dataeventrecordedit/dataeventrecordedit.component');
var DataeventrecordComponent = (function () {
    function DataeventrecordComponent() {
    }
    DataeventrecordComponent = __decorate([
        core_1.Component({
            selector: 'dataeventrecord',
            templateUrl: 'app/dataeventrecord/dataeventrecord/dataeventrecord.component.html',
            directives: [common_1.CORE_DIRECTIVES, router_1.ROUTER_DIRECTIVES],
            providers: [DataEventRecordsService_1.DataEventRecordsService]
        }),
        router_1.RouteConfig([
            { path: '/', name: 'Dataeventrecords', component: dataeventrecords_component_1.DataeventrecordsComponent, useAsDefault: true },
            { path: '/create', name: 'Dataeventrecordcreate', component: dataeventrecordcreate_component_1.DataeventrecordcreateComponent },
            { path: '/edit/:Id', name: 'Dataeventrecordedit', component: dataeventrecordedit_component_1.DataeventrecordeditComponent },
        ]), 
        __metadata('design:paramtypes', [])
    ], DataeventrecordComponent);
    return DataeventrecordComponent;
})();
exports.DataeventrecordComponent = DataeventrecordComponent;
//# sourceMappingURL=dataeventrecord.component.js.map