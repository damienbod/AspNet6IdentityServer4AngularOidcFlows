import { provideRouter, RouterConfig } from '@angular/router';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {SecurityService} from './services/SecurityService';
import {SecureFilesComponent} from './securefile/securefiles.component';
import {DataEventRecordsComponent} from './dataeventrecords/dataeventrecords.component';

export const routes: RouterConfig = [
    { path: 'Forbidden', component: ForbiddenComponent },
    { path: 'Unauthorized', component: UnauthorizedComponent },
    { path: 'securefile/securefiles',  component: SecureFilesComponent },
    { path: 'dataeventrecords/...', component: DataEventRecordsComponent }

];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
