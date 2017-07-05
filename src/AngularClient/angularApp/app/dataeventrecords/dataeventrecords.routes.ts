import { Routes, RouterModule } from '@angular/router';
import { DataEventRecordsListComponent } from './dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords-edit.component';

export const DATA_RECORDS_ROUTES: Routes = [
    {
        path: 'dataeventrecords',

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