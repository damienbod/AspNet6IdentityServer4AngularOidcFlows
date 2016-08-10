"use strict";
var router_1 = require('@angular/router');
var dataeventrecords_list_component_1 = require('../dataeventrecords/dataeventrecords-list.component');
var dataeventrecords_create_component_1 = require('../dataeventrecords/dataeventrecords-create.component');
var dataeventrecords_edit_component_1 = require('../dataeventrecords/dataeventrecords-edit.component');
var dataEventRecordsRoutes = [
    { path: '', component: dataeventrecords_list_component_1.DataEventRecordsListComponent },
    {
        path: 'create',
        component: dataeventrecords_create_component_1.DataEventRecordsCreateComponent
    },
    {
        path: 'edit/:id',
        component: dataeventrecords_edit_component_1.DataEventRecordsEditComponent
    },
    {
        path: 'list',
        component: dataeventrecords_list_component_1.DataEventRecordsListComponent,
    }
];
exports.dataEventRecordsRouting = router_1.RouterModule.forChild(dataEventRecordsRoutes);
//# sourceMappingURL=dataeventrecords.routes.js.map