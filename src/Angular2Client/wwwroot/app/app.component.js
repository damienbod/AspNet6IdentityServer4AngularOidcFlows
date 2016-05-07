System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AppComponent;
    return {
        setters:[],
        execute: function() {
            ;
            ;
            AppComponent = (function () {
                function AppComponent(securityService) {
                    this.securityService = securityService;
                }
                AppComponent.prototype.ngOnInit = function () {
                    console.log("ngOnInit _securityService.AuthorizedCallback");
                    if (window.location.hash) {
                        this.securityService.AuthorizedCallback();
                    }
                };
                AppComponent.prototype.Login = function () {
                    console.log("Do login logic");
                    this.securityService.Authorize();
                };
                AppComponent.prototype.Logout = function () {
                    console.log("Do logout logic");
                    this.securityService.Logoff();
                };
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map