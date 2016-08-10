import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';

import { SecurityService } from './services/SecurityService';
import { SecureFileService } from './securefile/SecureFileService';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { SecureFilesComponent } from './securefile/securefiles.component';

import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';

@NgModule({
    imports: [
        BrowserModule,
        //CommonModule,
        //FormsModule,
        routing,
        DataEventRecordsModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent,
        SecureFilesComponent      
    ],
    providers: [
        SecurityService,
        SecureFileService,
        Configuration
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {}