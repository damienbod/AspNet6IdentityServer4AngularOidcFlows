import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from '../auth/angular-auth-oidc-client';
import { User } from './models/User';

@Injectable()
export class UserManagementService {

    private actionUrl: string;
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private _http: HttpClient, configuration: Configuration, private _securityService: OidcSecurityService) {
        this.actionUrl = `${configuration.Server}api/UserManagement`;
    }

    private setHeaders() {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');

        const token = this._securityService.getToken();
        if (token !== '') {
            const tokenValue = 'Bearer ' + token;
            this.headers = this.headers.append('Authorization', tokenValue);
        }
    }

    public GetAll = (): Observable<User[]> => {
        this.setHeaders();

        return this._http.get<User[]>(this.actionUrl, { headers: this.headers });
    }

    public Update = (id: string, itemToUpdate: User): Observable<any> => {
        this.setHeaders();
        return this._http.put(
            this.actionUrl + '/' + id,
            JSON.stringify(itemToUpdate),
            { headers: this.headers }
        );
    }
}
