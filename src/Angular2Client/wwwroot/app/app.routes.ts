import { Routes, RouterModule } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecurityService } from './services/SecurityService';
import { SecureFilesComponent } from './securefile/securefiles.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'Forbidden', component: ForbiddenComponent },
    { path: 'Unauthorized', component: UnauthorizedComponent },
    { path: 'securefile/securefiles', component: SecureFilesComponent },
	{ path: 'dataeventrecords', loadChildren: './dataeventrecords/dataeventrecords.module' }
];

export const routing = RouterModule.forRoot(appRoutes);