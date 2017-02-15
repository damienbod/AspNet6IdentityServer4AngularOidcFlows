import { Routes, RouterModule } from '@angular/router';
import { DataEventRecordsListComponent } from './dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords-edit.component';

export const DATA_RECORDS_ROUTES: Routes = [
    {
        path: 'dataeventrecords',

        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full'},
            {
                path: 'create',
                component: DataEventRecordsCreateComponent
            },
            {
                path: 'edit/:id',
                component: DataEventRecordsEditComponent
            },
            {
                path: 'list',
                component: DataEventRecordsListComponent,
            }
        ]
    }
];