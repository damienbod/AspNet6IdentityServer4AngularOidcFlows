import { RouterModule } from '@angular/router';
import { DataEventRecordsListComponent } from './components/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './components/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './components/dataeventrecords-edit.component';
var routes = [
    {
        path: 'dataeventrecords/create',
        component: DataEventRecordsCreateComponent
    },
    {
        path: 'dataeventrecords/edit/:id',
        component: DataEventRecordsEditComponent
    },
    {
        path: 'dataeventrecords',
        component: DataEventRecordsListComponent,
    }
];
export var DataEventRecordsRoutes = RouterModule.forChild(routes);
//# sourceMappingURL=dataeventrecords.routes.js.map