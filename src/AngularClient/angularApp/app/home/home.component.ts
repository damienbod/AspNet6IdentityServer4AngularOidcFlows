import { Component, OnInit } from '@angular/core';

import { Language, LocaleService } from 'angular-l10n';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    @Language() lang: string;

    constructor(public locale: LocaleService) {
    }

    ngOnInit() {
    }
}
