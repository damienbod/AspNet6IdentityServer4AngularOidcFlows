import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    message: string;
    name = 'none';
    email = 'none';

    constructor(public securityService: OidcSecurityService) {
        this.message = 'HomeComponent constructor';
    }

    ngOnInit() {
        if (this.securityService.isAuthorized) {
            let userData = this.securityService.getUserData();
            console.log(userData);
            this.name = userData.name;
            this.email = userData.email;
        }
    }
}
