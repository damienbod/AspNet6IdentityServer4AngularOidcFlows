webpackJsonp([0],{

/***/ 0:
/*!*****************************!*\
  !*** ./wwwroot/app/boot.ts ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var platform_browser_dynamic_1 = __webpack_require__(/*! @angular/platform-browser-dynamic */ 1);
	var http_1 = __webpack_require__(/*! @angular/http */ 325);
	var app_component_1 = __webpack_require__(/*! ./app.component */ 346);
	var app_constants_1 = __webpack_require__(/*! ./app.constants */ 397);
	var SecurityService_1 = __webpack_require__(/*! ./services/SecurityService */ 396);
	var app_routes_1 = __webpack_require__(/*! ./app.routes */ 399);
	platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
	    app_routes_1.APP_ROUTER_PROVIDERS,
	    http_1.HTTP_PROVIDERS,
	    app_constants_1.Configuration,
	    SecurityService_1.SecurityService
	]);


/***/ },

/***/ 346:
/*!**************************************!*\
  !*** ./wwwroot/app/app.component.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var SecurityService_1 = __webpack_require__(/*! ./services/SecurityService */ 396);
	var DataEventRecordsService_1 = __webpack_require__(/*! ./dataeventrecords/DataEventRecordsService */ 398);
	var AppComponent = (function () {
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
	    AppComponent = __decorate([
	        core_1.Component({
	            selector: 'my-app',
	            templateUrl: 'app/app.component.html',
	            styleUrls: ['app/app.component.css'],
	            directives: [router_1.ROUTER_DIRECTIVES],
	            providers: [
	                DataEventRecordsService_1.DataEventRecordsService
	            ]
	        }), 
	        __metadata('design:paramtypes', [SecurityService_1.SecurityService])
	    ], AppComponent);
	    return AppComponent;
	}());
	exports.AppComponent = AppComponent;


/***/ },

/***/ 396:
/*!*************************************************!*\
  !*** ./wwwroot/app/services/SecurityService.ts ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var http_1 = __webpack_require__(/*! @angular/http */ 325);
	__webpack_require__(/*! rxjs/add/operator/map */ 350);
	var app_constants_1 = __webpack_require__(/*! ../app.constants */ 397);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var SecurityService = (function () {
	    function SecurityService(_http, _configuration, _router) {
	        this._http = _http;
	        this._configuration = _configuration;
	        this._router = _router;
	        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';
	        this.headers = new http_1.Headers();
	        this.headers.append('Content-Type', 'application/json');
	        this.headers.append('Accept', 'application/json');
	        this.storage = localStorage;
	        if (this.retrieve("IsAuthorized") !== "") {
	            this.HasAdminRole = this.retrieve("HasAdminRole");
	            this.IsAuthorized = this.retrieve("IsAuthorized");
	        }
	    }
	    SecurityService.prototype.GetToken = function () {
	        return this.retrieve("authorizationData");
	    };
	    SecurityService.prototype.ResetAuthorizationData = function () {
	        this.store("authorizationData", "");
	        this.store("authorizationDataIdToken", "");
	        this.IsAuthorized = false;
	        this.HasAdminRole = false;
	        this.store("HasAdminRole", false);
	        this.store("IsAuthorized", false);
	    };
	    SecurityService.prototype.SetAuthorizationData = function (token, id_token) {
	        if (this.retrieve("authorizationData") !== "") {
	            this.store("authorizationData", "");
	        }
	        this.store("authorizationData", token);
	        this.store("authorizationDataIdToken", id_token);
	        this.IsAuthorized = true;
	        this.store("IsAuthorized", true);
	        var data = this.getDataFromToken(token);
	        for (var i = 0; i < data.role.length; i++) {
	            if (data.role[i] === "dataEventRecords.admin") {
	                this.HasAdminRole = true;
	                this.store("HasAdminRole", true);
	            }
	        }
	    };
	    SecurityService.prototype.Authorize = function () {
	        this.ResetAuthorizationData();
	        console.log("BEGIN Authorize, no auth data");
	        var authorizationUrl = 'https://localhost:44345/connect/authorize';
	        var client_id = 'angular2client';
	        var redirect_uri = 'https://localhost:44311';
	        var response_type = "id_token token";
	        var scope = "dataEventRecords securedFiles openid";
	        var nonce = "N" + Math.random() + "" + Date.now();
	        var state = Date.now() + "" + Math.random();
	        this.store("authStateControl", state);
	        this.store("authNonce", nonce);
	        console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));
	        var url = authorizationUrl + "?" +
	            "response_type=" + encodeURI(response_type) + "&" +
	            "client_id=" + encodeURI(client_id) + "&" +
	            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
	            "scope=" + encodeURI(scope) + "&" +
	            "nonce=" + encodeURI(nonce) + "&" +
	            "state=" + encodeURI(state);
	        window.location.href = url;
	    };
	    SecurityService.prototype.AuthorizedCallback = function () {
	        console.log("BEGIN AuthorizedCallback, no auth data");
	        this.ResetAuthorizationData();
	        var hash = window.location.hash.substr(1);
	        var result = hash.split('&').reduce(function (result, item) {
	            var parts = item.split('=');
	            result[parts[0]] = parts[1];
	            return result;
	        }, {});
	        console.log(result);
	        console.log("AuthorizedCallback created, begin token validation");
	        var token = "";
	        var id_token = "";
	        var authResponseIsValid = false;
	        if (!result.error) {
	            if (result.state !== this.retrieve("authStateControl")) {
	                console.log("AuthorizedCallback incorrect state");
	            }
	            else {
	                token = result.access_token;
	                id_token = result.id_token;
	                var dataIdToken = this.getDataFromToken(id_token);
	                console.log(dataIdToken);
	                if (dataIdToken.nonce !== this.retrieve("authNonce")) {
	                    console.log("AuthorizedCallback incorrect nonce");
	                }
	                else {
	                    this.store("authNonce", "");
	                    this.store("authStateControl", "");
	                    authResponseIsValid = true;
	                    console.log("AuthorizedCallback state and nonce validated, returning access token");
	                }
	            }
	        }
	        if (authResponseIsValid) {
	            this.SetAuthorizationData(token, id_token);
	            console.log(this.retrieve("authorizationData"));
	            this._router.navigate(['/dataeventrecords']);
	        }
	        else {
	            this.ResetAuthorizationData();
	            this._router.navigate(['/Unauthorized']);
	        }
	    };
	    SecurityService.prototype.Logoff = function () {
	        console.log("BEGIN Authorize, no auth data");
	        var authorizationUrl = 'https://localhost:44345/connect/endsession';
	        var id_token_hint = this.retrieve("authorizationDataIdToken");
	        var post_logout_redirect_uri = 'https://localhost:44311/Unauthorized.html';
	        var url = authorizationUrl + "?" +
	            "id_token_hint=" + encodeURI(id_token_hint) + "&" +
	            "post_logout_redirect_uri=" + encodeURI(post_logout_redirect_uri);
	        this.ResetAuthorizationData();
	        window.location.href = url;
	    };
	    SecurityService.prototype.HandleError = function (error) {
	        console.log(error);
	        if (error.status == 403) {
	            this._router.navigate(['/Forbidden']);
	        }
	        else if (error.status == 401) {
	            this.ResetAuthorizationData();
	            this._router.navigate(['/Unauthorized']);
	        }
	    };
	    SecurityService.prototype.urlBase64Decode = function (str) {
	        var output = str.replace('-', '+').replace('_', '/');
	        switch (output.length % 4) {
	            case 0:
	                break;
	            case 2:
	                output += '==';
	                break;
	            case 3:
	                output += '=';
	                break;
	            default:
	                throw 'Illegal base64url string!';
	        }
	        return window.atob(output);
	    };
	    SecurityService.prototype.getDataFromToken = function (token) {
	        var data = {};
	        if (typeof token !== 'undefined') {
	            var encoded = token.split('.')[1];
	            data = JSON.parse(this.urlBase64Decode(encoded));
	        }
	        return data;
	    };
	    SecurityService.prototype.retrieve = function (key) {
	        var item = this.storage.getItem(key);
	        if (item && item !== 'undefined') {
	            return JSON.parse(this.storage.getItem(key));
	        }
	        return;
	    };
	    SecurityService.prototype.store = function (key, value) {
	        this.storage.setItem(key, JSON.stringify(value));
	    };
	    SecurityService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration, router_1.Router])
	    ], SecurityService);
	    return SecurityService;
	}());
	exports.SecurityService = SecurityService;


/***/ },

/***/ 397:
/*!**************************************!*\
  !*** ./wwwroot/app/app.constants.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var Configuration = (function () {
	    function Configuration() {
	        this.Server = "https://localhost:44390/";
	        this.FileServer = "https://localhost:44378/";
	    }
	    Configuration = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [])
	    ], Configuration);
	    return Configuration;
	}());
	exports.Configuration = Configuration;


/***/ },

/***/ 398:
/*!*****************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/DataEventRecordsService.ts ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var http_1 = __webpack_require__(/*! @angular/http */ 325);
	__webpack_require__(/*! rxjs/add/operator/map */ 350);
	var app_constants_1 = __webpack_require__(/*! ../app.constants */ 397);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var DataEventRecordsService = (function () {
	    function DataEventRecordsService(_http, _configuration, _securityService) {
	        var _this = this;
	        this._http = _http;
	        this._configuration = _configuration;
	        this._securityService = _securityService;
	        this.GetAll = function () {
	            _this.setHeaders();
	            return _this._http.get(_this.actionUrl, {
	                headers: _this.headers
	            }).map(function (res) { return res.json(); });
	        };
	        this.GetById = function (id) {
	            _this.setHeaders();
	            return _this._http.get(_this.actionUrl + id, {
	                headers: _this.headers
	            }).map(function (res) { return res.json(); });
	        };
	        this.Add = function (itemToAdd) {
	            _this.setHeaders();
	            return _this._http.post(_this.actionUrl, JSON.stringify(itemToAdd), { headers: _this.headers });
	        };
	        this.Update = function (id, itemToUpdate) {
	            _this.setHeaders();
	            return _this._http
	                .put(_this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: _this.headers });
	        };
	        this.Delete = function (id) {
	            _this.setHeaders();
	            return _this._http.delete(_this.actionUrl + id, {
	                headers: _this.headers
	            });
	        };
	        this.actionUrl = _configuration.Server + "api/DataEventRecords/";
	    }
	    DataEventRecordsService.prototype.setHeaders = function () {
	        this.headers = new http_1.Headers();
	        this.headers.append('Content-Type', 'application/json');
	        this.headers.append('Accept', 'application/json');
	        var token = this._securityService.GetToken();
	        if (token !== "") {
	            this.headers.append('Authorization', 'Bearer ' + token);
	        }
	    };
	    DataEventRecordsService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration, SecurityService_1.SecurityService])
	    ], DataEventRecordsService);
	    return DataEventRecordsService;
	}());
	exports.DataEventRecordsService = DataEventRecordsService;


/***/ },

/***/ 399:
/*!***********************************!*\
  !*** ./wwwroot/app/app.routes.ts ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var forbidden_component_1 = __webpack_require__(/*! ./forbidden/forbidden.component */ 400);
	var unauthorized_component_1 = __webpack_require__(/*! ./unauthorized/unauthorized.component */ 401);
	var securefiles_component_1 = __webpack_require__(/*! ./securefile/securefiles.component */ 402);
	var dataeventrecords_routes_1 = __webpack_require__(/*! ./dataeventrecords/dataeventrecords.routes */ 404);
	exports.routes = [
	    { path: 'Forbidden', component: forbidden_component_1.ForbiddenComponent },
	    { path: 'Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
	    { path: 'securefile/securefiles', component: securefiles_component_1.SecureFilesComponent }
	].concat(dataeventrecords_routes_1.DataEventRecordsRoutes);
	exports.APP_ROUTER_PROVIDERS = [
	    router_1.provideRouter(exports.routes)
	];


/***/ },

/***/ 400:
/*!******************************************************!*\
  !*** ./wwwroot/app/forbidden/forbidden.component.ts ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var ForbiddenComponent = (function () {
	    function ForbiddenComponent() {
	        this.message = "ForbiddenComponent constructor";
	    }
	    ForbiddenComponent.prototype.ngOnInit = function () {
	    };
	    ForbiddenComponent = __decorate([
	        core_1.Component({
	            selector: 'forbidden',
	            templateUrl: 'app/forbidden/forbidden.component.html',
	            directives: [common_1.CORE_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ForbiddenComponent);
	    return ForbiddenComponent;
	}());
	exports.ForbiddenComponent = ForbiddenComponent;


/***/ },

/***/ 401:
/*!************************************************************!*\
  !*** ./wwwroot/app/unauthorized/unauthorized.component.ts ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var UnauthorizedComponent = (function () {
	    function UnauthorizedComponent() {
	        this.message = "UnauthorizedComponent constructor";
	    }
	    UnauthorizedComponent.prototype.ngOnInit = function () {
	    };
	    UnauthorizedComponent = __decorate([
	        core_1.Component({
	            selector: 'unauthorized',
	            templateUrl: 'app/unauthorized/unauthorized.component.html',
	            directives: [common_1.CORE_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], UnauthorizedComponent);
	    return UnauthorizedComponent;
	}());
	exports.UnauthorizedComponent = UnauthorizedComponent;


/***/ },

/***/ 402:
/*!*********************************************************!*\
  !*** ./wwwroot/app/securefile/securefiles.component.ts ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var SecureFileService_1 = __webpack_require__(/*! ./SecureFileService */ 403);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var SecureFilesComponent = (function () {
	    function SecureFilesComponent(_secureFileService, securityService) {
	        this._secureFileService = _secureFileService;
	        this.securityService = securityService;
	        this.message = "Secure Files download";
	    }
	    SecureFilesComponent.prototype.ngOnInit = function () {
	        this.getData();
	    };
	    SecureFilesComponent.prototype.DownloadFileById = function (id) {
	        this._secureFileService.DownloadFile(id);
	    };
	    SecureFilesComponent.prototype.getData = function () {
	        var _this = this;
	        this._secureFileService.GetListOfFiles()
	            .subscribe(function (data) { return _this.Files = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('Get all completed'); });
	    };
	    SecureFilesComponent = __decorate([
	        core_1.Component({
	            selector: 'securefiles',
	            templateUrl: 'app/securefile/securefiles.component.html',
	            directives: [common_1.CORE_DIRECTIVES],
	            providers: [SecureFileService_1.SecureFileService]
	        }), 
	        __metadata('design:paramtypes', [SecureFileService_1.SecureFileService, SecurityService_1.SecurityService])
	    ], SecureFilesComponent);
	    return SecureFilesComponent;
	}());
	exports.SecureFilesComponent = SecureFilesComponent;


/***/ },

/***/ 403:
/*!*****************************************************!*\
  !*** ./wwwroot/app/securefile/SecureFileService.ts ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var http_1 = __webpack_require__(/*! @angular/http */ 325);
	__webpack_require__(/*! rxjs/add/operator/map */ 350);
	var app_constants_1 = __webpack_require__(/*! ../app.constants */ 397);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var SecureFileService = (function () {
	    function SecureFileService(_http, _configuration, _securityService) {
	        var _this = this;
	        this._http = _http;
	        this._configuration = _configuration;
	        this._securityService = _securityService;
	        this.GetListOfFiles = function () {
	            _this.setHeaders();
	            return _this._http.get(_this.fileExplorerUrl, {
	                headers: _this.headers
	            }).map(function (res) { return res.json(); });
	        };
	        this.actionUrl = _configuration.FileServer + "api/Download/";
	        this.fileExplorerUrl = _configuration.FileServer + "api/FileExplorer/";
	    }
	    SecureFileService.prototype.DownloadFile = function (id) {
	        var _this = this;
	        this.setHeaders();
	        var oneTimeAccessToken = "";
	        this._http.get(this.actionUrl + "GenerateOneTimeAccessToken/" + id, {
	            headers: this.headers
	        }).map(function (res) { return res.text(); }).subscribe(function (data) {
	            oneTimeAccessToken = data;
	        }, function (error) { return _this._securityService.HandleError(error); }, function () {
	            console.log("open DownloadFile for file " + id + ": " + _this.actionUrl + oneTimeAccessToken);
	            window.open("" + _this.actionUrl + oneTimeAccessToken);
	        });
	    };
	    SecureFileService.prototype.setHeaders = function () {
	        this.headers = new http_1.Headers();
	        this.headers.append('Content-Type', 'application/json');
	        this.headers.append('Accept', 'application/json');
	        var token = this._securityService.GetToken();
	        if (token !== "") {
	            this.headers.append('Authorization', 'Bearer ' + token);
	        }
	    };
	    SecureFileService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [http_1.Http, app_constants_1.Configuration, SecurityService_1.SecurityService])
	    ], SecureFileService);
	    return SecureFileService;
	}());
	exports.SecureFileService = SecureFileService;


/***/ },

/***/ 404:
/*!*****************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/dataeventrecords.routes.ts ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var dataeventrecords_component_1 = __webpack_require__(/*! ../dataeventrecords/dataeventrecords.component */ 405);
	var dataeventrecords_list_component_1 = __webpack_require__(/*! ../dataeventrecords/dataeventrecords-list.component */ 406);
	var dataeventrecords_create_component_1 = __webpack_require__(/*! ../dataeventrecords/dataeventrecords-create.component */ 407);
	var dataeventrecords_edit_component_1 = __webpack_require__(/*! ../dataeventrecords/dataeventrecords-edit.component */ 408);
	exports.DataEventRecordsRoutes = [
	    {
	        path: 'dataeventrecords',
	        component: dataeventrecords_component_1.DataEventRecordsComponent,
	        children: [
	            {
	                path: '',
	                component: dataeventrecords_list_component_1.DataEventRecordsListComponent,
	            },
	            {
	                path: 'create',
	                component: dataeventrecords_create_component_1.DataEventRecordsCreateComponent
	            },
	            {
	                path: 'edit/:id',
	                component: dataeventrecords_edit_component_1.DataEventRecordsEditComponent
	            }
	        ]
	    }
	];


/***/ },

/***/ 405:
/*!********************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/dataeventrecords.component.ts ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var DataEventRecordsComponent = (function () {
	    function DataEventRecordsComponent() {
	    }
	    DataEventRecordsComponent = __decorate([
	        core_1.Component({
	            selector: 'dataeventrecords',
	            templateUrl: 'app/dataeventrecords/dataeventrecords.component.html',
	            directives: [common_1.CORE_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], DataEventRecordsComponent);
	    return DataEventRecordsComponent;
	}());
	exports.DataEventRecordsComponent = DataEventRecordsComponent;


/***/ },

/***/ 406:
/*!*************************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/dataeventrecords-list.component.ts ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var DataEventRecordsService_1 = __webpack_require__(/*! ../dataeventrecords/DataEventRecordsService */ 398);
	var DataEventRecordsListComponent = (function () {
	    function DataEventRecordsListComponent(_dataEventRecordsService, securityService, _router) {
	        this._dataEventRecordsService = _dataEventRecordsService;
	        this.securityService = securityService;
	        this._router = _router;
	        this.message = "DataEventRecords";
	    }
	    DataEventRecordsListComponent.prototype.ngOnInit = function () {
	        this.getData();
	    };
	    DataEventRecordsListComponent.prototype.Delete = function (id) {
	        var _this = this;
	        console.log("Try to delete" + id);
	        this._dataEventRecordsService.Delete(id)
	            .subscribe((function () { return console.log("subscribed"); }), function (error) { return _this.securityService.HandleError(error); }, function () { return _this.getData(); });
	    };
	    DataEventRecordsListComponent.prototype.getData = function () {
	        var _this = this;
	        console.log('DataEventRecordsListComponent:getData starting...');
	        this._dataEventRecordsService
	            .GetAll()
	            .subscribe(function (data) { return _this.DataEventRecords = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('Get all completed'); });
	    };
	    DataEventRecordsListComponent = __decorate([
	        core_1.Component({
	            selector: 'dataeventrecords-list',
	            templateUrl: 'app/dataeventrecords/dataeventrecords-list.component.html',
	            directives: [common_1.CORE_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, SecurityService_1.SecurityService, router_1.Router])
	    ], DataEventRecordsListComponent);
	    return DataEventRecordsListComponent;
	}());
	exports.DataEventRecordsListComponent = DataEventRecordsListComponent;


/***/ },

/***/ 407:
/*!***************************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/dataeventrecords-create.component.ts ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var DataEventRecordsService_1 = __webpack_require__(/*! ../dataeventrecords/DataEventRecordsService */ 398);
	var DataEventRecordsCreateComponent = (function () {
	    function DataEventRecordsCreateComponent(_dataEventRecordsService, securityService, _router) {
	        this._dataEventRecordsService = _dataEventRecordsService;
	        this.securityService = securityService;
	        this._router = _router;
	        this.message = "DataEventRecords Create";
	    }
	    DataEventRecordsCreateComponent.prototype.ngOnInit = function () {
	        this.DataEventRecord = { Id: 0, Name: "", Description: "" };
	        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
	        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
	    };
	    DataEventRecordsCreateComponent.prototype.Create = function () {
	        var _this = this;
	        this._dataEventRecordsService
	            .Add(this.DataEventRecord)
	            .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return _this._router.navigate(['/dataeventrecords']); });
	    };
	    DataEventRecordsCreateComponent = __decorate([
	        core_1.Component({
	            selector: 'dataeventrecords-create',
	            templateUrl: 'app/dataeventrecords/dataeventrecords-create.component.html',
	            directives: [common_1.CORE_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, SecurityService_1.SecurityService, router_1.Router])
	    ], DataEventRecordsCreateComponent);
	    return DataEventRecordsCreateComponent;
	}());
	exports.DataEventRecordsCreateComponent = DataEventRecordsCreateComponent;


/***/ },

/***/ 408:
/*!*************************************************************************!*\
  !*** ./wwwroot/app/dataeventrecords/dataeventrecords-edit.component.ts ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(/*! @angular/core */ 5);
	var router_1 = __webpack_require__(/*! @angular/router */ 347);
	var common_1 = __webpack_require__(/*! @angular/common */ 2);
	var SecurityService_1 = __webpack_require__(/*! ../services/SecurityService */ 396);
	var DataEventRecordsService_1 = __webpack_require__(/*! ../dataeventrecords/DataEventRecordsService */ 398);
	var DataEventRecordsEditComponent = (function () {
	    function DataEventRecordsEditComponent(_dataEventRecordsService, securityService, _route, _router) {
	        this._dataEventRecordsService = _dataEventRecordsService;
	        this.securityService = securityService;
	        this._route = _route;
	        this._router = _router;
	        this.message = "DataEventRecords Edit";
	    }
	    DataEventRecordsEditComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        console.log("IsAuthorized:" + this.securityService.IsAuthorized);
	        console.log("HasAdminRole:" + this.securityService.HasAdminRole);
	        this.sub = this._route.params.subscribe(function (params) {
	            var id = +params['id'];
	            if (!_this.DataEventRecord) {
	                _this._dataEventRecordsService.GetById(id)
	                    .subscribe(function (data) { return _this.DataEventRecord = data; }, function (error) { return _this.securityService.HandleError(error); }, function () { return console.log('DataEventRecordsEditComponent:Get by Id complete'); });
	            }
	        });
	    };
	    DataEventRecordsEditComponent.prototype.ngOnDestroy = function () {
	        this.sub.unsubscribe();
	    };
	    DataEventRecordsEditComponent.prototype.Update = function () {
	        var _this = this;
	        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
	            .subscribe((function () { return console.log("subscribed"); }), function (error) { return _this.securityService.HandleError(error); }, function () { return _this._router.navigate(['/dataeventrecords']); });
	    };
	    DataEventRecordsEditComponent = __decorate([
	        core_1.Component({
	            selector: 'dataeventrecords-edit',
	            templateUrl: 'app/dataeventrecords/dataeventrecords-edit.component.html',
	            directives: [common_1.CORE_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [DataEventRecordsService_1.DataEventRecordsService, SecurityService_1.SecurityService, router_1.ActivatedRoute, router_1.Router])
	    ], DataEventRecordsEditComponent);
	    return DataEventRecordsEditComponent;
	}());
	exports.DataEventRecordsEditComponent = DataEventRecordsEditComponent;


/***/ }

});
//# sourceMappingURL=app.bundle.js.map