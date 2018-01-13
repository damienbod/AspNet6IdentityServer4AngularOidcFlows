import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OidcConfigService {
    config: any;
    wellKnown: any;

    constructor(private http: HttpClient) {
    }

    load(configUrl: string) {
        return new Promise((resolve, reject) => {
            this.http.get(configUrl)
                .subscribe(config => {
                    this.config = config;
                    console.log('APP_INITIALIZER CONFIG FINISHED LOAD');
                    this.http.get(`${this.config.stsServer}/.well-known/openid-configuration`)
                        .subscribe(wellKnown => {
                            this.wellKnown = wellKnown;
                            console.log('APP_INITIALIZER WELL KNOWN FINISHED LOAD');
                            console.log(this.config);
                            console.log(this.wellKnown);

                            resolve(true);
                        },
                        _ => {
                            console.error('Configuration failed to load');
                            reject(true);
                        })
                },
                _ => {
                    console.error('Configuration failed to load');
                    reject(true);
                });
        });
    }
}
