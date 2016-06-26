"use strict";
var dataeventrecords_component_1 = require('../dataeventrecords/dataeventrecords.component');
var dataeventrecords_list_component_1 = require('../dataeventrecords/dataeventrecords-list.component');
var dataeventrecords_create_component_1 = require('../dataeventrecords/dataeventrecords-create.component');
var dataeventrecords_edit_component_1 = require('../dataeventrecords/dataeventrecords-edit.component');
exports.DataEventRecordsRoutes = [
    {
        path: 'dataeventrecords',
        component: dataeventrecords_component_1.DataEventRecordsComponent,
        children: [
            {
                path: '',
                component: dataeventrecords_list_component_1.DataEventRecordsListComponent,
            },
            {
                path: 'create',
                component: dataeventrecords_create_component_1.DataEventRecordsCreateComponent
            },
            {
                path: 'edit/:id',
                component: dataeventrecords_edit_component_1.DataEventRecordsEditComponent
            }
        ]
    }
];
//# sourceMappingURL=dataeventrecords.routes.js.map