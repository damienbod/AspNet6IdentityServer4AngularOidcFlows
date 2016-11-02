// Entry point for JiT compilation.
export * from './polyfills';
export * from './vendor';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
