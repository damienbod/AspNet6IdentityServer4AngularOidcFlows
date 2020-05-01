import { Component } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    templateUrl: 'unauthorized.component.html'
})

export class UnauthorizedComponent {

    public message: string;
    public values: any[] = [];

    constructor() {
        this.message = 'UnauthorizedComponent constructor';
    }
}
