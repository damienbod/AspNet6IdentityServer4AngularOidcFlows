import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public Server = 'https://localhost:44390/';
    public FileServer: string = 'https://localhost:44378/';
}