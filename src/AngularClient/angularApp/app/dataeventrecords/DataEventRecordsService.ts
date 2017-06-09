import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { DataEventRecord } from './models/DataEventRecord';

@Injectable()
export class DataEventRecordsService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: OidcSecurityService) {
        this.actionUrl = `${_configuration.Server}api/DataEventRecords/`;
    }

    private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        let token = this._securityService.getToken();
        if (token !== '') {
            let tokenValue = 'Bearer ' + token;
            this.headers.append('Authorization', tokenValue);
        }
    }

    public GetAll = (): Observable<DataEventRecord[]> => {
        this.setHeaders();
        let options = new RequestOptions({ headers: this.headers, body: '' });

        return this._http.get(this.actionUrl, options).map(res => res.json());
    }

    public GetById = (id: number): Observable<DataEventRecord> => {
        this.setHeaders();
        return this._http.get(this.actionUrl + id, {
            headers: this.headers,
            body: ''
        }).map(res => res.json());
    }

    public Add = (itemToAdd: any): Observable<Response> => {
        this.setHeaders();
        return this._http.post(this.actionUrl, JSON.stringify(itemToAdd), { headers: this.headers });
    }

    public Update = (id: number, itemToUpdate: any): Observable<Response> => {
        this.setHeaders();
        return this._http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers });
    }

    public Delete = (id: number): Observable<Response> => {
        this.setHeaders();
        return this._http.delete(this.actionUrl + id, {
            headers: this.headers
        });
    }

}