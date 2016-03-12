import { Injectable } from 'angular2/core';

@Injectable()
export class Configuration {
    public Server: string = "https://localhost:44390/";
    public FileServer: string = "https://localhost:44378/";
}