import { provideRouter, RouterConfig } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecurityService } from './services/SecurityService';
import { SecureFilesComponent } from './securefile/securefiles.component';
import { DataEventRecordsRoutes } from './dataeventrecords/dataeventrecords.routes';

export const routes: RouterConfig = [
    { path: 'Forbidden', component: ForbiddenComponent },
    { path: 'Unauthorized', component: UnauthorizedComponent },
    { path: 'securefile/securefiles',  component: SecureFilesComponent },
    ...DataEventRecordsRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];