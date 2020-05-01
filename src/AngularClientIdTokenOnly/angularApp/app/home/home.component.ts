import {
    OidcClientNotification,
    OidcSecurityService,
} from '../auth/angular-auth-oidc-client';
import { Component, OnInit } from '@angular/core';
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    message: string;
    name = 'none';
    email = 'none';

    userDataChanged$: Observable<OidcClientNotification<any>>;
    userData$: Observable<any>;
    isAuthenticated$: Observable<boolean>;

    constructor(public oidcSecurityService: OidcSecurityService) {
        console.log('AppComponent STARTING');
    }

    ngOnInit() {
        this.userData$ = this.oidcSecurityService.userData$;
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

        this.userData$.pipe(
            map((userData: any) => {
                console.log('userData: ', userData);

                if (userData !== '') {
                    this.name = userData.name;
                    this.email = userData.email;
                    console.log(userData);
                }
            }));
    }
}
