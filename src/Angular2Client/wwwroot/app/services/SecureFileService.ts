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

    constructor(private _http: Http, private _configuration: Configuration, private _securityService: SecurityService) {
        this.actionUrl = _configuration.FileServer + 'api/Download/'; 
        this.fileExplorerUrl = _configuration.FileServer + 'api/FileExplorer/';    
    }

    public GetDownloadfileUrl(id: string): string {
        var token = this._securityService.GetToken();
        return this.actionUrl + id + "?access_token=" + token;
    }

    public GetListOfFiles = (): Observable<string[]> => {
        var token = this._securityService.GetToken();

        return this._http.get(this.fileExplorerUrl + "?access_token=" + token, {
        }).map(res => res.json());
    }

}