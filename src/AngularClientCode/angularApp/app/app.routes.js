import { RouterModule } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationCanGuard } from './authorization.can.guard';
var appRoutes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    {
        path: 'securefiles',
        component: SecureFilesComponent,
        canActivate: [AuthorizationGuard],
        canLoad: [AuthorizationCanGuard]
    }
];
export var routing = RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routes.js.map