import { provideRouter, RouterConfig } from '@angular/router';
import { DataEventRecordsComponent } from '../dataeventrecords/dataeventrecords.component';
import { DataEventRecordsListComponent } from '../dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from '../dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from '../dataeventrecords/dataeventrecords-edit.component';

export const DataEventRecordsRoutes: RouterConfig = [
    {
        path: 'dataeventrecords',
        component: DataEventRecordsComponent,
        children: [
            {
                path: 'create',
                component: DataEventRecordsCreateComponent
            },
            {
                path: 'edit/:id',
                component: DataEventRecordsEditComponent
            },
            {
                path: '',
                component: DataEventRecordsListComponent,
            }
        ]
    }
];