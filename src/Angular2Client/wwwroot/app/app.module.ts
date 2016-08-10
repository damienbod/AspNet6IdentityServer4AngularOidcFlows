import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';

import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { SecurityService } from './services/SecurityService';
import { routing } from './app.routes';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';

@NgModule({
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent
    ],
    imports: [
        BrowserModule,
        routing,
        HTTP_PROVIDERS,
        Configuration,
        SecurityService,
        DataEventRecordsModule
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {}