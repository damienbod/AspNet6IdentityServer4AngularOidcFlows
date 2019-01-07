import './styles.scss';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';

// Styles.
// Enables Hot Module Replacement.
declare var module: any;

if (module.hot) {
    module.hot.accept();
}

platformBrowserDynamic().bootstrapModule(AppModule);
