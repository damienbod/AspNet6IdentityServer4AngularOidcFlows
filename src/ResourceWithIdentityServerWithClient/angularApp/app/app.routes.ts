import { Routes, RouterModule } from '@angular/router';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DATA_RECORDS_ROUTES } from './dataeventrecords/dataeventrecords.routes';

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
    ...DATA_RECORDS_ROUTES,
];

export const routing = RouterModule.forRoot(appRoutes);
