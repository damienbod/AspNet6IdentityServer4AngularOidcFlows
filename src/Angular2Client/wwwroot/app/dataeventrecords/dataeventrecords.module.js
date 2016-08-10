"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var dataeventrecords_routes_1 = require('./dataeventrecords.routes');
var dataeventrecords_create_component_1 = require('./dataeventrecords-create.component');
var dataeventrecords_edit_component_1 = require('./dataeventrecords-edit.component');
var dataeventrecords_list_component_1 = require('./dataeventrecords-list.component');
var DataEventRecordsService_1 = require('./DataEventRecordsService');
var DataEventRecordsModule = (function () {
    function DataEventRecordsModule() {
    }
    DataEventRecordsModule = __decorate([
        core_1.NgModule({
            declarations: [
                dataeventrecords_create_component_1.DataEventRecordsCreateComponent,
                dataeventrecords_edit_component_1.DataEventRecordsEditComponent,
                dataeventrecords_list_component_1.DataEventRecordsListComponent
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                dataeventrecords_routes_1.dataEventRecordsRouting
            ],
            providers: [
                DataEventRecordsService_1.DataEventRecordsService,
                http_1.HTTP_PROVIDERS
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], DataEventRecordsModule);
    return DataEventRecordsModule;
}());
exports.DataEventRecordsModule = DataEventRecordsModule;
//# sourceMappingURL=dataeventrecords.module.js.map