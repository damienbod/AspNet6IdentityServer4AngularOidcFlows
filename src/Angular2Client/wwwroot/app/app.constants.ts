import { Injectable } from 'angular2/core';

@Injectable()
export class Configuration {
    public Server: string = "http://localhost:5000/";
    public ApiUrl: string = "api/";
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}