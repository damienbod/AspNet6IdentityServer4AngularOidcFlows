import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { SecurityService } from '../services/SecurityService';

@Injectable()
export class SecureFileService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: SecurityService) {
        this.actionUrl = _configuration.FileServer + 'api/Download/';   
    }

    private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/octet-stream');
        this.headers.append('Accept', 'application/octet-stream');

        var token = this._securityService.GetToken();

        if (token !== "") {
            this.headers.append('Authorization', 'Bearer ' + token);
        }
    }

    public GetDownloadfileUrl(id: string): string {
        var token = this._securityService.GetToken();
        return this.actionUrl + id + "?access_token=" + token;
    }
}