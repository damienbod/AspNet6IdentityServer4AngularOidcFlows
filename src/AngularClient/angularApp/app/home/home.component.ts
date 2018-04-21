import { Component, OnInit } from '@angular/core';

import { Language, LocaleService } from 'angular-l10n';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    @Language() lang = 'en';

    constructor(public locale: LocaleService) {
    }

    ngOnInit() {
    }
}
