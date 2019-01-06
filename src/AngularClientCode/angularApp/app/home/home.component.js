var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Language, LocaleService } from 'angular-l10n';
var HomeComponent = (function () {
    function HomeComponent(locale) {
        this.locale = locale;
        this.lang = 'en';
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Language(),
        __metadata("design:type", Object)
    ], HomeComponent.prototype, "lang", void 0);
    HomeComponent = __decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.component.html'
        }),
        __metadata("design:paramtypes", [LocaleService])
    ], HomeComponent);
    return HomeComponent;
}());
export { HomeComponent };
//# sourceMappingURL=home.component.js.map