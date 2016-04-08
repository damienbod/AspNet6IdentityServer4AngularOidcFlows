System.register(['angular2/core', 'angular2/common', 'angular2/router', '../dataeventrecords/dataeventrecords-list.component', '../dataeventrecords/dataeventrecords-create.component', '../dataeventrecords/dataeventrecords-edit.component'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, dataeventrecords_list_component_1, dataeventrecords_create_component_1, dataeventrecords_edit_component_1;
    var DataEventRecordsComponent;
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
            function (dataeventrecords_list_component_1_1) {
                dataeventrecords_list_component_1 = dataeventrecords_list_component_1_1;
            },
            function (dataeventrecords_create_component_1_1) {
                dataeventrecords_create_component_1 = dataeventrecords_create_component_1_1;
            },
            function (dataeventrecords_edit_component_1_1) {
                dataeventrecords_edit_component_1 = dataeventrecords_edit_component_1_1;
            }],
        execute: function() {
            DataEventRecordsComponent = (function () {
                function DataEventRecordsComponent() {
                }
                DataEventRecordsComponent = __decorate([
                    core_1.Component({
                        selector: 'dataeventrecords',
                        templateUrl: 'app/dataeventrecords/dataeventrecords.component.html',
                        directives: [common_1.CORE_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/',
                            name: 'DataEventRecordsList',
                            component: dataeventrecords_list_component_1.DataEventRecordsListComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/create',
                            name: 'DataEventRecordsCreate',
                            component: dataeventrecords_create_component_1.DataEventRecordsCreateComponent
                        },
                        {
                            path: '/edit/:id',
                            name: 'DataEventRecordsEdit',
                            component: dataeventrecords_edit_component_1.DataEventRecordsEditComponent
                        },
                    ]), 
                    __metadata('design:paramtypes', [])
                ], DataEventRecordsComponent);
                return DataEventRecordsComponent;
            }());
            exports_1("DataEventRecordsComponent", DataEventRecordsComponent);
        }
    }
});
//# sourceMappingURL=dataeventrecords.component.js.map