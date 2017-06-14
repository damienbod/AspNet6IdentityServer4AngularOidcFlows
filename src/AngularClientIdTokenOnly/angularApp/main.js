import './vendor';
import './polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
if (module.hot) {
    module.hot.accept();
}
platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=main.js.map