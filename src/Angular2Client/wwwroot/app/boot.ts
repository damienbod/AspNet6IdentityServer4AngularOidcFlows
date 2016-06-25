import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { SecurityService } from './services/SecurityService';
import { APP_ROUTER_PROVIDERS } from './app.routes';


bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    Configuration,
    SecurityService
]);
