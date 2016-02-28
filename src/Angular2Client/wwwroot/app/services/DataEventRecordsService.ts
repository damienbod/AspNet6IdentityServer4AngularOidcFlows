import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { SecurityService } from '../services/SecurityService';

@Injectable()
export class DataEventRecordsService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: SecurityService) {
        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';   
    }

    private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        var token = this._securityService.GetToken();

        if (token !== "") {
            this.headers.append('Authorization', 'Bearer ' + token);
        }
    }

    public GetAll = (): Observable<Response> => {
        this.setHeaders();
        return this._http.get(this.actionUrl, {
            headers: this.headers
        }).map(res => res.json());
    }

    public GetById = (id: number): Observable<Response> => {
        this.setHeaders();
        return this._http.get(this.actionUrl + id, {
            headers: this.headers
        }).map(res => res.json());
    }

    public Add = (itemName: any): Observable<Response> => {
        var toAdd = JSON.stringify({ ItemName: itemName });

        this.setHeaders();
        return this._http.post(this.actionUrl, toAdd, { headers: this.headers }).map(res => res.json());
    }

    public Update = (id: number, itemToUpdate: any): Observable<Response> => {
        this.setHeaders();
        return this._http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers })
            .map(res => res.json());
    }

    public Delete = (id: number): Observable<Response> => {
        this.setHeaders();
        return this._http.delete(this.actionUrl + id, {
            headers: this.headers
        });
    }

}