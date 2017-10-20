import { Routes, RouterModule } from '@angular/router';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'securefiles', component: SecureFilesComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
