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
var DataService_1 = require('../services/DataService');
var CreateComponent = (function () {
    function CreateComponent(_dataService) {
        this._dataService = _dataService;
        this.message = "Hello from create Component constructor";
    }
    CreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._dataService
            .GetAll()
            .subscribe(function (data) { return _this.values = data; }, function (error) { return console.log(error); }, function () { return console.log('Get all complete'); });
    };
    CreateComponent = __decorate([
        core_1.Component({
            selector: 'create',
            templateUrl: 'app/create/create.component.html',
            directives: [common_1.CORE_DIRECTIVES],
            providers: [DataService_1.DataService]
        }), 
        __metadata('design:paramtypes', [DataService_1.DataService])
    ], CreateComponent);
    return CreateComponent;
})();
exports.CreateComponent = CreateComponent;
//# sourceMappingURL=create.component.js.map