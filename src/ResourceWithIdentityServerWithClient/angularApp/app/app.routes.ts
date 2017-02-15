import { Routes, RouterModule } from '@angular/router';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DataEventRecordsListComponent } from './dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords/dataeventrecords-edit.component';

import { UserManagementComponent } from './user-management/user-management.component';

import { HasAdminRoleAuthenticationGuard } from './guards/hasAdminRoleAuthenticationGuard';
import { HasAdminRoleCanLoadGuard } from './guards/hasAdminRoleCanLoadGuard';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'uihome', component: HomeComponent },
    {
        path: 'usermanagement', component: UserManagementComponent,
        canActivate: [HasAdminRoleAuthenticationGuard],
        canLoad: [HasAdminRoleCanLoadGuard]
    },
    { path: 'Forbidden', component: ForbiddenComponent },
    { path: 'Unauthorized', component: UnauthorizedComponent },
    {
        path: 'dataeventrecords', component: DataEventRecordsListComponent
    },
    {
        path: 'dataeventrecords/create',
        component: DataEventRecordsCreateComponent
    },
    {
        path: 'dataeventrecords/edit/:id',
        component: DataEventRecordsEditComponent
    },
    {
        path: 'dataeventrecords/list',
        component: DataEventRecordsListComponent,
    }
];

export const routing = RouterModule.forRoot(appRoutes);
