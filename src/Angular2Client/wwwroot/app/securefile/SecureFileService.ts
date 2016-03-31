import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { SecurityService } from '../services/SecurityService';

@Injectable()
export class SecureFileService {

    private actionUrl: string;
    private fileExplorerUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: SecurityService) {
        this.actionUrl = `${_configuration.FileServer}api/Download/`; 
        this.fileExplorerUrl = `${_configuration.FileServer }api/FileExplorer/`;    
    }

    public GetDownloadfileUrl(id: string) {
        this.setHeaders();
        let oneTimeAccessToken = "";
        this._http.get(`${this.actionUrl}GenerateOneTimeAccessToken/${id}`, {
            headers: this.headers
        }).map(
            res => res.json()
            ).subscribe(
            data => {
                oneTimeAccessToken = data;
                window.open(`${this.actionUrl}${id}?onetime_token=${oneTimeAccessToken}`);
            },
            error => this._securityService.HandleError(error),
            () => console.log('GetDownloadfileUrl completed'));
    }

  

    public GetListOfFiles = (): Observable<string[]> => {
        this.setHeaders();
        return this._http.get(this.fileExplorerUrl, {
            headers: this.headers
        }).map(res => res.json());
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

}