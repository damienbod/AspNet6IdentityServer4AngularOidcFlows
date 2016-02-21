var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var SecurityService_1 = require('../services/SecurityService');
var AuthorizeComponent = (function () {
    function AuthorizeComponent(_securityService) {
        this._securityService = _securityService;
        this.message = "AuthorizeComponent constructor";
    }
    AuthorizeComponent.prototype.ngOnInit = function () {
        this._securityService.Authorize();
    };
    AuthorizeComponent = __decorate([
        core_1.Component({
            selector: 'authorize',
            templateUrl: 'app/authorize/authorize.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [SecurityService_1.SecurityService]
        }), 
        __metadata('design:paramtypes', [SecurityService_1.SecurityService])
    ], AuthorizeComponent);
    return AuthorizeComponent;
})();
exports.AuthorizeComponent = AuthorizeComponent;
//# sourceMappingURL=authorize.component.js.map