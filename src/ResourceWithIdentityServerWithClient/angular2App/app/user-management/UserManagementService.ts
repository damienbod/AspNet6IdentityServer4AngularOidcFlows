import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { SecurityService } from '../services/SecurityService';
import { User } from './models/User';

@Injectable()
export class UserManagementService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: SecurityService) {
        this.actionUrl = `${_configuration.Server}/api/UserManagement/`;
    }

    private setHeaders() {

        console.log('setHeaders started');

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        let token = this._securityService.GetToken();
        if (token !== '') {
            let tokenValue = 'Bearer ' + token;
            console.log('tokenValue:' + tokenValue);
            this.headers.append('Authorization', tokenValue);
        }
    }

    public GetAll = (): Observable<User[]> => {
        this.setHeaders();
        let options = new RequestOptions({ headers: this.headers, body: '' });

        return this._http.get(this.actionUrl, options).map(res => res.json());
    }

    public Update = (id: string, itemToUpdate: User): Observable<Response> => {
        this.setHeaders();
        return this._http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers });
    }
}