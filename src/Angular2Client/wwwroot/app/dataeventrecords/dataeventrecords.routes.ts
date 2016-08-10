import { Routes, RouterModule } from '@angular/router';
import { DataEventRecordsComponent } from '../dataeventrecords/dataeventrecords.component';
import { DataEventRecordsListComponent } from '../dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from '../dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from '../dataeventrecords/dataeventrecords-edit.component';

const dataEventRecordsRoutes: Routes = [
    {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full'
    },
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
];

export const dataEventRecordsRouting = RouterModule.forChild(dataEventRecordsRoutes);

