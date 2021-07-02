import { TestBed } from '@angular/core/testing';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { ConfigurationProvider } from '../../config/provider/config.provider';
import { ConfigurationProviderMock } from '../../config/provider/config.provider-mock';
import { FlowsDataService } from '../../flows/flows-data.service';
import { FlowsDataServiceMock } from '../../flows/flows-data.service-mock';
import { LoggerService } from '../../logging/logger.service';
import { LoggerServiceMock } from '../../logging/logger.service-mock';
import { StoragePersistenceService } from '../../storage/storage-persistence.service';
import { StoragePersistenceServiceMock } from '../../storage/storage-persistence.service-mock';
import { JsrsAsignReducedService } from '../../validation/jsrsasign-reduced.service';
import { JsrsAsignReducedServiceMock } from '../../validation/jsrsasign-reduced.service-mock';
import { FlowHelper } from '../flowHelper/flow-helper.service';
import { UrlService } from './url.service';

describe('UrlService Tests', () => {
  let service: UrlService;
  let configurationProvider: ConfigurationProvider;
  let flowHelper: FlowHelper;
  let flowsDataService: FlowsDataService;
  let jsrsAsignReducedService: JsrsAsignReducedService;
  let storagePersistenceService: StoragePersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlService,
        { provide: ConfigurationProvider, useClass: ConfigurationProviderMock },
        {
          provide: LoggerService,
          useClass: LoggerServiceMock,
        },
        {
          provide: FlowsDataService,
          useClass: FlowsDataServiceMock,
        },
        FlowHelper,
        { provide: StoragePersistenceService, useClass: StoragePersistenceServiceMock },
        { provide: JsrsAsignReducedService, useClass: JsrsAsignReducedServiceMock },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UrlService);
    configurationProvider = TestBed.inject(ConfigurationProvider);
    flowHelper = TestBed.inject(FlowHelper);
    flowsDataService = TestBed.inject(FlowsDataService);
    jsrsAsignReducedService = TestBed.inject(JsrsAsignReducedService);
    storagePersistenceService = TestBed.inject(StoragePersistenceService);
  });

  afterEach(() => {
    configurationProvider.setConfig(null);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('isCallbackFromSts', () => {
    const testingValues = [
      { param: 'code', isCallbackFromSts: true },
      { param: 'state', isCallbackFromSts: true },
      { param: 'token', isCallbackFromSts: true },
      { param: 'id_token', isCallbackFromSts: true },
      { param: 'some_param', isCallbackFromSts: false },
    ];

    testingValues.forEach(({ param, isCallbackFromSts }) => {
      it(`should return ${isCallbackFromSts} when param is ${param}`, () => {
        const result = service.isCallbackFromSts(`https://any.url/?${param}=anyvalue`);
        expect(result).toBe(isCallbackFromSts);
      });
    });
  });

  describe('getUrlParameter', () => {
    it('returns empty string when there is no urlToCheck', () => {
      const result = service.getUrlParameter('', 'code');

      expect(result).toBe('');
    });

    it('returns empty string when there is no name', () => {
      const result = service.getUrlParameter('url', '');

      expect(result).toBe('');
    });

    it('returns empty string when name is not a uri', () => {
      const result = service.getUrlParameter('url', 'anything');

      expect(result).toBe('');
    });

    it('parses Url correctly with hash in the end', () => {
      const urlToCheck = 'https://www.example.com/signin?code=thisisacode&state=0000.1234.000#';
      const code = service.getUrlParameter(urlToCheck, 'code');
      const state = service.getUrlParameter(urlToCheck, 'state');

      expect(code).toBe('thisisacode');
      expect(state).toBe('0000.1234.000');
    });

    it('parses url with special chars in param and hash in the end', () => {
      const urlToCheck = 'https://www.example.com/signin?code=thisisa$-_.+!*(),code&state=0000.1234.000#';
      const code = service.getUrlParameter(urlToCheck, 'code');
      const state = service.getUrlParameter(urlToCheck, 'state');

      expect(code).toBe('thisisa$-_.+!*(),code');
      expect(state).toBe('0000.1234.000');
    });

    it('parses Url correctly with number&delimiter in params', () => {
      const urlToCheck = 'https://www.example.com/signin?code=thisisacode&state=0000.1234.000';
      const code = service.getUrlParameter(urlToCheck, 'code');
      const state = service.getUrlParameter(urlToCheck, 'state');

      expect(code).toBe('thisisacode');
      expect(state).toBe('0000.1234.000');
    });

    it('gets correct param if params divided vith slash', () => {
      const urlToCheck = 'https://www.example.com/signin?state=0000.1234.000&ui_locales=de&code=thisisacode#lang=de';
      const code = service.getUrlParameter(urlToCheck, 'code');
      const state = service.getUrlParameter(urlToCheck, 'state');

      expect(code).toBe('thisisacode');
      expect(state).toBe('0000.1234.000');
    });
  });

  describe('createAuthorizeUrl', () => {
    it('returns null when no authoizationendpoint given -> wellKnownEndpoints null', () => {
      configurationProvider.setConfig(null);

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        'https://localhost:44386',
        'nonce',
        'state'
      );

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('returns null when no authoizationendpoint given -> configurationProvider null', () => {
      (service as any).configurationProvider = null;

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        'https://localhost:44386',
        'nonce',
        'state'
      );

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('returns null when clientId is null', () => {
      const clientId = null;
      const authorizationEndpoint = 'authorizationEndpoint';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId });
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        'https://localhost:44386',
        'nonce',
        'state',
        'configId'
      );

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('returns null when responseType is null', () => {
      const clientId = 'something';
      const responseType = null;
      const authorizationEndpoint = 'authorizationEndpoint';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, responseType });
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        'https://localhost:44386',
        'nonce',
        'state',
        'configId'
      );

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('returns null when scope is null', () => {
      const clientId = 'something';
      const responseType = 'responsetype';
      const scope = null;
      const authorizationEndpoint = 'authorizationEndpoint';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, responseType, scope });
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        'https://localhost:44386',
        'nonce',
        'state',
        'configId'
      );

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with code flow adds "code_challenge" and "code_challenge_method" param', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'code';
      config.scope = 'openid email profile';
      config.redirectUrl = 'https://localhost:44386';

      config.customParamsAuthRequest = {
        testcustom: 'customvalue',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read')
        .withArgs('authWellKnownEndPoints', 'configId')
        .and.returnValue({ authorizationEndpoint: 'http://example' });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        'configId'
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=code' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&code_challenge=&code_challenge_method=S256' +
        '&testcustom=customvalue';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with prompt adds prompt value', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.configId = 'configId';

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId,
        'myprompt'
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&prompt=myprompt';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with prompt and custom values adds prompt value and custom values', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.configId = 'configId';

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId,
        'myprompt',
        { to: 'add', as: 'well' }
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&prompt=myprompt' +
        '&to=add&as=well';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with hdParam adds hdparam value', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.hdParam = 'myHdParam';
      config.configId = 'configId';

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&hd=myHdParam';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with custom value', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.configId = 'configId';

      config.customParamsAuthRequest = {
        testcustom: 'customvalue',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&testcustom=customvalue';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl with custom values', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.configId = 'configId';

      config.customParamsAuthRequest = {
        t4: 'ABC abc 123',
        t3: '#',
        t2: '-_.!~*()',
        t1: ';,/?:@&=+$',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state&t4=ABC%20abc%20123&t3=%23&t2=-_.!~*()&t1=%3B%2C%2F%3F%3A%40%26%3D%2B%24';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl creates url with with custom values and dynamic custom values', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        configId: 'configId',
        customParamsAuthRequest: {
          t4: 'ABC abc 123',
          t3: '#',
          t2: '-_.!~*()',
          t1: ';,/?:@&=+$',
        },
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId,
        null,
        { to: 'add', as: 'well' }
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&t4=ABC%20abc%20123&t3=%23&t2=-_.!~*()&t1=%3B%2C%2F%3F%3A%40%26%3D%2B%24' +
        '&to=add&as=well';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl creates url with custom values equals null and dynamic custom values', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        customParamsAuthRequest: null,
        configId: 'configId',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId,
        null,
        { to: 'add', as: 'well' }
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&to=add&as=well';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl creates url with custom values not given and dynamic custom values', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        configId: 'configId',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId,
        null,
        { to: 'add', as: 'well' }
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state' +
        '&to=add&as=well';

      expect(value).toEqual(expectValue);
    });

    // https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-oidc
    it('createAuthorizeUrl with custom url like active-directory-b2c', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = 'myid';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=b2c_1_sign_in',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        'configId'
      );

      const expectValue =
        'https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=b2c_1_sign_in' +
        '&client_id=myid' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state';

      expect(value).toEqual(expectValue);
    });

    it('createAuthorizeUrl default', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.configId = 'configId';

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'http://example',
      });

      const value = (service as any).createAuthorizeUrl(
        '', // Implicit Flow
        config.redirectUrl,
        'nonce',
        'state',
        config.configId
      );

      const expectValue =
        'http://example?client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com' +
        '&redirect_uri=https%3A%2F%2Flocalhost%3A44386' +
        '&response_type=id_token%20token' +
        '&scope=openid%20email%20profile' +
        '&nonce=nonce' +
        '&state=state';

      expect(value).toEqual(expectValue);
    });

    it('createRevocationBody access_token default', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.postLogoutRedirectUri = 'https://localhost:44386/Unauthorized';

      const revocationEndpoint = 'http://example?cod=ddd';
      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        revocationEndpoint,
      });

      const value = service.createRevocationEndpointBodyAccessToken('mytoken', 'configId');
      const expectValue =
        'client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com&token=mytoken&token_type_hint=access_token';

      expect(value).toEqual(expectValue);
    });

    it('createRevocationEndpointBodyAccessToken returns null when no clientId is given', () => {
      const config = { stsServer: 'https://localhost:5001', clientId: null } as OpenIdConfiguration;

      configurationProvider.setConfig(config);

      const value = service.createRevocationEndpointBodyAccessToken('mytoken', 'configId');

      expect(value).toBeNull();
    });

    it('createRevocationBody refresh_token default', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.postLogoutRedirectUri = 'https://localhost:44386/Unauthorized';

      const revocationEndpoint = 'http://example?cod=ddd';
      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        revocationEndpoint,
      });

      const value = service.createRevocationEndpointBodyRefreshToken('mytoken', 'configId');
      const expectValue =
        'client_id=188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com&token=mytoken&token_type_hint=refresh_token';

      expect(value).toEqual(expectValue);
    });

    it('createRevocationEndpointBodyRefreshToken returns null when no clientId is given', () => {
      const config = { stsServer: 'https://localhost:5001', clientId: null } as OpenIdConfiguration;

      configurationProvider.setConfig(config);

      const value = service.createRevocationEndpointBodyRefreshToken('mytoken', 'configId');

      expect(value).toBeNull();
    });

    it('getRevocationEndpointUrl with params', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.postLogoutRedirectUri = 'https://localhost:44386/Unauthorized';

      const revocationEndpoint = 'http://example?cod=ddd';
      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        revocationEndpoint,
      });

      const value = service.getRevocationEndpointUrl('configId');

      const expectValue = 'http://example';

      expect(value).toEqual(expectValue);
    });

    it('getRevocationEndpointUrl default', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.postLogoutRedirectUri = 'https://localhost:44386/Unauthorized';

      const revocationEndpoint = 'http://example';
      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        revocationEndpoint,
      });

      const value = service.getRevocationEndpointUrl('configId');

      const expectValue = 'http://example';

      expect(value).toEqual(expectValue);
    });

    it('getRevocationEndpointUrl returns null when there is not revociationendpoint given', () => {
      configurationProvider.setConfig(null);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        revocationEndpoint: null,
      });
      const value = service.getRevocationEndpointUrl('configId');

      expect(value).toBeNull();
    });

    it('getRevocationEndpointUrl returns null when there is no wellKnownEndpoints given', () => {
      configurationProvider.setConfig(null);

      const value = service.getRevocationEndpointUrl('configId');

      expect(value).toBeNull();
    });
  });

  describe('getAuthorizeUrl', () => {
    it('calls createUrlCodeFlowAuthorize if current flow is code flow', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(true);
      const spy = spyOn(service as any, 'createUrlCodeFlowAuthorize');
      service.getAuthorizeUrl('configId');
      expect(spy).toHaveBeenCalled();
    });

    it('calls createUrlImplicitFlowAuthorize if current flow is NOT code flow', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(false);
      const spyCreateUrlCodeFlowAuthorize = spyOn(service as any, 'createUrlCodeFlowAuthorize');
      const spyCreateUrlImplicitFlowAuthorize = spyOn(service as any, 'createUrlImplicitFlowAuthorize');
      service.getAuthorizeUrl('configId');
      expect(spyCreateUrlCodeFlowAuthorize).not.toHaveBeenCalled();
      expect(spyCreateUrlImplicitFlowAuthorize).toHaveBeenCalled();
    });

    it('return empty string if flow is not code flow and createUrlImplicitFlowAuthorize returns falsy', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(false);
      const spy = spyOn(service as any, 'createUrlImplicitFlowAuthorize').and.returnValue('');
      const result = service.getAuthorizeUrl('configId');
      expect(spy).toHaveBeenCalled();
      expect(result).toBe('');
    });
  });

  describe('getRefreshSessionSilentRenewUrl', () => {
    it('calls createUrlCodeFlowWithSilentRenew if current flow is code flow', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(true);
      const spy = spyOn(service as any, 'createUrlCodeFlowWithSilentRenew');
      service.getRefreshSessionSilentRenewUrl('configId');
      expect(spy).toHaveBeenCalled();
    });

    it('calls createUrlImplicitFlowWithSilentRenew if current flow is NOT code flow', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(false);
      const spyCreateUrlCodeFlowWithSilentRenew = spyOn(service as any, 'createUrlCodeFlowWithSilentRenew');
      const spyCreateUrlImplicitFlowWithSilentRenew = spyOn(service as any, 'createUrlImplicitFlowWithSilentRenew');
      service.getRefreshSessionSilentRenewUrl('configId');
      expect(spyCreateUrlCodeFlowWithSilentRenew).not.toHaveBeenCalled();
      expect(spyCreateUrlImplicitFlowWithSilentRenew).toHaveBeenCalled();
    });

    it('return empty string if flow is not code flow and createUrlImplicitFlowWithSilentRenew returns falsy', () => {
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(false);
      const spy = spyOn(service as any, 'createUrlImplicitFlowWithSilentRenew').and.returnValue('');
      const result = service.getRefreshSessionSilentRenewUrl('configId');
      expect(spy).toHaveBeenCalled();
      expect(result).toBe('');
    });
  });

  describe('createBodyForCodeFlowCodeRequest', () => {
    it('returns null if no code verifier is set', () => {
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(null);
      const result = service.createBodyForCodeFlowCodeRequest('notRelevantParam', 'configId');
      expect(result).toBeNull();
    });

    it('returns null if no clientId is set', () => {
      const codeVerifier = 'codeverifier';
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(codeVerifier);
      const clientId = null;
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId });
      const result = service.createBodyForCodeFlowCodeRequest('notRelevantParam', 'configId');
      expect(result).toBeNull();
    });

    it('returns null if silentrenewRunning is false and redirectUrl is falsy', () => {
      const codeVerifier = 'codeverifier';
      const code = 'code';
      const redirectUrl = null;
      const clientId = 'clientId';
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(codeVerifier);
      spyOn(flowsDataService, 'isSilentRenewRunning').and.returnValue(false);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, redirectUrl });

      const result = service.createBodyForCodeFlowCodeRequest(code, 'configId');

      expect(result).toBeNull();
    });

    it('returns correctUrl with silentrenewRunning is false', () => {
      const codeVerifier = 'codeverifier';
      const code = 'code';
      const redirectUrl = 'redirectUrl';
      const clientId = 'clientId';
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(codeVerifier);
      spyOn(flowsDataService, 'isSilentRenewRunning').and.returnValue(false);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, redirectUrl });

      const result = service.createBodyForCodeFlowCodeRequest(code, 'configId');
      const expected = `grant_type=authorization_code&client_id=${clientId}&code_verifier=${codeVerifier}&code=${code}&redirect_uri=${redirectUrl}`;

      expect(result).toBe(expected);
    });

    it('returns correctUrl with silentrenewRunning is true', () => {
      const codeVerifier = 'codeverifier';
      const code = 'code';
      const silentRenewUrl = 'silentRenewUrl';
      const clientId = 'clientId';
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(codeVerifier);
      spyOn(flowsDataService, 'isSilentRenewRunning').and.returnValue(true);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, silentRenewUrl });

      const result = service.createBodyForCodeFlowCodeRequest(code, 'configId');
      const expected = `grant_type=authorization_code&client_id=${clientId}&code_verifier=${codeVerifier}&code=${code}&redirect_uri=${silentRenewUrl}`;

      expect(result).toBe(expected);
    });

    it('returns correctUrl when customTokenParams are provided', () => {
      const codeVerifier = 'codeverifier';
      const code = 'code';
      const silentRenewUrl = 'silentRenewUrl';
      const clientId = 'clientId';
      const customTokenParams = { foo: 'bar' };
      spyOn(flowsDataService, 'getCodeVerifier').and.returnValue(codeVerifier);
      spyOn(flowsDataService, 'isSilentRenewRunning').and.returnValue(true);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId, silentRenewUrl });

      const result = service.createBodyForCodeFlowCodeRequest(code, 'configId', customTokenParams);
      const expected = `grant_type=authorization_code&client_id=${clientId}&code_verifier=${codeVerifier}&code=${code}&foo=bar&redirect_uri=${silentRenewUrl}`;

      expect(result).toBe(expected);
    });
  });

  describe('createBodyForCodeFlowRefreshTokensRequest', () => {
    it('returns correct url', () => {
      const clientId = 'clientId';
      const refreshToken = 'refreshToken';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId });
      const result = service.createBodyForCodeFlowRefreshTokensRequest(refreshToken, 'configId');
      expect(result).toBe(`grant_type=refresh_token&client_id=${clientId}&refresh_token=${refreshToken}`);
    });

    it('returns correct url with custom params if custom params are passed', () => {
      const clientId = 'clientId';
      const refreshToken = 'refreshToken';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId });
      const result = service.createBodyForCodeFlowRefreshTokensRequest(refreshToken, 'configId', { any: 'thing' });
      expect(result).toBe(`grant_type=refresh_token&client_id=${clientId}&refresh_token=${refreshToken}&any=thing`);
    });

    it('returns null if clientId is falsy', () => {
      const clientId = '';
      const refreshToken = 'refreshToken';
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId });
      const result = service.createBodyForCodeFlowRefreshTokensRequest(refreshToken, 'configId');
      expect(result).toBe(null);
    });
  });

  describe('createBodyForParCodeFlowRequest', () => {
    it('returns null redirectUrl is falsy', () => {
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ redirectUrl: '' });
      const result = service.createBodyForParCodeFlowRequest('configId');
      expect(result).toBe(null);
    });

    it('returns basic url with no extras if properties are given', () => {
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        clientId: 'testClientId',
        responseType: 'testResponseType',
        scope: 'testScope',
        hdParam: null,
        customParamsAuthRequest: null,
        redirectUrl: 'testRedirectUrl',
      });
      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue('testState');
      spyOn(flowsDataService, 'createNonce').and.returnValue('testNonce');
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue('testCodeVerifier');
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue('testCodeChallenge');

      const result = service.createBodyForParCodeFlowRequest('configId');
      expect(result).toBe(
        `client_id=testClientId&redirect_uri=testRedirectUrl&response_type=testResponseType&scope=testScope&nonce=testNonce&state=testState&code_challenge=testCodeChallenge&code_challenge_method=S256`
      );
    });

    it('returns basic url with hdParam if properties are given', () => {
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        clientId: 'testClientId',
        responseType: 'testResponseType',
        scope: 'testScope',
        hdParam: 'testHdParam',
        customParamsAuthRequest: null,
        redirectUrl: 'testRedirectUrl',
      });
      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue('testState');
      spyOn(flowsDataService, 'createNonce').and.returnValue('testNonce');
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue('testCodeVerifier');
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue('testCodeChallenge');

      const result = service.createBodyForParCodeFlowRequest('configId');
      expect(result).toBe(
        `client_id=testClientId&redirect_uri=testRedirectUrl&response_type=testResponseType&scope=testScope&nonce=testNonce&state=testState&code_challenge=testCodeChallenge&code_challenge_method=S256&hd=testHdParam`
      );
    });

    it('returns basic url with hdParam and custom params if properties are given', () => {
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        clientId: 'testClientId',
        responseType: 'testResponseType',
        scope: 'testScope',
        hdParam: 'testHdParam',
        customParamsAuthRequest: { any: 'thing' },
        redirectUrl: 'testRedirectUrl',
      });
      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue('testState');
      spyOn(flowsDataService, 'createNonce').and.returnValue('testNonce');
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue('testCodeVerifier');
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue('testCodeChallenge');

      const result = service.createBodyForParCodeFlowRequest('configId');
      expect(result).toBe(
        `client_id=testClientId&redirect_uri=testRedirectUrl&response_type=testResponseType&scope=testScope&nonce=testNonce&state=testState&code_challenge=testCodeChallenge&code_challenge_method=S256&hd=testHdParam&any=thing`
      );
    });

    it('returns basic url with hdParam and custom params and passed cutom params if properties are given', () => {
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        clientId: 'testClientId',
        responseType: 'testResponseType',
        scope: 'testScope',
        hdParam: 'testHdParam',
        customParamsAuthRequest: { any: 'thing' },
        redirectUrl: 'testRedirectUrl',
      });
      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue('testState');
      spyOn(flowsDataService, 'createNonce').and.returnValue('testNonce');
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue('testCodeVerifier');
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue('testCodeChallenge');

      const result = service.createBodyForParCodeFlowRequest('configId', { any: 'otherThing' });
      expect(result).toBe(
        `client_id=testClientId&redirect_uri=testRedirectUrl&response_type=testResponseType&scope=testScope&nonce=testNonce&state=testState&code_challenge=testCodeChallenge&code_challenge_method=S256&hd=testHdParam&any=thing&any=otherThing`
      );
    });
  });

  describe('createUrlImplicitFlowWithSilentRenew', () => {
    it('returns null if silentrenewUrl is falsy', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = null;

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        silentRenewUrl,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowWithSilentRenew();
      expect(result).toBeNull();
    });

    it('returns correct url if wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = 'http://any-url.com';
      const authorizationEndpoint = 'authorizationEndpoint';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const scope = 'testScope';
      const configId = 'configId';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', configId).and.returnValue({
        authorizationEndpoint,
      });
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        silentRenewUrl,
        clientId,
        responseType,
        scope,
        configId,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowWithSilentRenew(configId);
      expect(result).toBe(
        `authorizationEndpoint?client_id=${clientId}&redirect_uri=http%3A%2F%2Fany-url.com&response_type=${responseType}&scope=${scope}&nonce=${nonce}&state=${state}&prompt=none`
      );
    });

    it('returns correct url if wellknownendpoints are not given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = 'http://any-url.com';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const configId = 'configId';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', configId).and.returnValue(null);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        silentRenewUrl,
        clientId,
        responseType,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowWithSilentRenew(configId);
      expect(result).toBe(null);
    });
  });

  describe('createUrlCodeFlowWithSilentRenew', () => {
    it('returns null if silentrenewUrl is falsy', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = null;
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge ';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        silentRenewUrl,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowWithSilentRenew();
      expect(result).toBeNull();
    });

    it('returns correct url if wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = 'http://any-url.com';
      const authorizationEndpoint = 'authorizationEndpoint';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge ';
      const scope = 'testScope';
      const configId = 'configId';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        silentRenewUrl,
        clientId,
        responseType,
        scope,
        configId,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowWithSilentRenew('configId');
      expect(result).toBe(
        `authorizationEndpoint?client_id=${clientId}&redirect_uri=http%3A%2F%2Fany-url.com&response_type=${responseType}&scope=${scope}&nonce=${nonce}&state=${state}&prompt=none`
      );
    });

    it('returns empty string if no wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const silentRenewUrl = 'http://any-url.com';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge ';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ silentRenewUrl, clientId, responseType });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowWithSilentRenew('configId');
      expect(result).toBe(null);
    });
  });

  describe('createUrlImplicitFlowAuthorize', () => {
    it('returns correct url if wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const redirectUrl = 'http://any-url.com';
      const authorizationEndpoint = 'authorizationEndpoint';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const scope = 'testScope';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        redirectUrl,
        clientId,
        responseType,
        scope,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowAuthorize('configId');
      expect(result).toBe(
        `authorizationEndpoint?client_id=clientId&redirect_uri=http%3A%2F%2Fany-url.com&response_type=${responseType}&scope=${scope}&nonce=${nonce}&state=${state}`
      );
    });

    it('returns empty string if no wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const redirectUrl = 'http://any-url.com';
      const clientId = 'clientId';
      const responseType = 'responseType';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ redirectUrl, clientId, responseType });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowAuthorize('configId');
      expect(result).toBe(null);
    });

    it('returns null if there is nor redirecturl', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const redirectUrl = '';
      const clientId = 'clientId';
      const responseType = 'responseType';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ redirectUrl, clientId, responseType });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlImplicitFlowAuthorize('configId');
      expect(result).toBe(null);
    });
  });

  describe('createUrlCodeFlowAuthorize', () => {
    it('returns null if redirectUrl  is falsy', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const redirectUrl = null;

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);

      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        redirectUrl,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowAuthorize('configId');
      expect(result).toBeNull();
    });

    it('returns correct url if wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const scope = 'testScope';
      const redirectUrl = 'http://any-url.com';
      const authorizationEndpoint = 'authorizationEndpoint';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge ';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        redirectUrl,
        clientId,
        responseType,
        scope,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowAuthorize('configId');
      expect(result).toBe(
        `authorizationEndpoint?client_id=clientId&redirect_uri=http%3A%2F%2Fany-url.com&response_type=${responseType}&scope=${scope}&nonce=${nonce}&state=${state}`
      );
    });

    it('returns correct url if wellknownendpoints and custom params are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const scope = 'testScope';
      const redirectUrl = 'http://any-url.com';
      const authorizationEndpoint = 'authorizationEndpoint';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge';
      const configId = 'configId';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ authorizationEndpoint });
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({
        redirectUrl,
        clientId,
        responseType,
        scope,
        configId,
      });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowAuthorize(configId, { to: 'add', as: 'well' });
      expect(result).toBe(
        `authorizationEndpoint?client_id=clientId&redirect_uri=http%3A%2F%2Fany-url.com` +
          `&response_type=${responseType}&scope=${scope}&nonce=${nonce}&state=${state}&to=add&as=well`
      );
    });

    it('returns empty string if no wellknownendpoints are given', () => {
      const state = 'testState';
      const nonce = 'testNonce';
      const redirectUrl = 'http://any-url.com';
      const clientId = 'clientId';
      const responseType = 'responseType';
      const codeVerifier = 'codeVerifier';
      const codeChallenge = 'codeChallenge ';

      spyOn(flowsDataService, 'getExistingOrCreateAuthStateControl').and.returnValue(state);
      spyOn(flowsDataService, 'createNonce').and.returnValue(nonce);
      spyOn(flowsDataService, 'createCodeVerifier').and.returnValue(codeVerifier);
      spyOn(jsrsAsignReducedService, 'generateCodeChallenge').and.returnValue(codeChallenge);

      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);
      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ redirectUrl, clientId, responseType });

      const serviceAsAny = service as any;

      const result = serviceAsAny.createUrlCodeFlowAuthorize('configId');
      expect(result).toBe(null);
    });
  });

  describe('createEndSessionUrl', () => {
    it('createEndSessionUrl create url when all parameters given', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        postLogoutRedirectUri: 'https://localhost:44386/Unauthorized',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        endSessionEndpoint: 'http://example',
      });

      const value = service.createEndSessionUrl('mytoken', 'configId');

      const expectValue = 'http://example?id_token_hint=mytoken&post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A44386%2FUnauthorized';

      expect(value).toEqual(expectValue);
    });

    it('createEndSessionUrl create url when all parameters and customParamsEndSession given', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        postLogoutRedirectUri: 'https://localhost:44386/Unauthorized',
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        endSessionEndpoint: 'http://example',
      });

      const value = service.createEndSessionUrl('mytoken', 'configId', { param: 'to-add' });

      const expectValue =
        'http://example?id_token_hint=mytoken&post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A44386%2FUnauthorized&param=to-add';

      expect(value).toEqual(expectValue);
    });

    it('createEndSessionUrl with azure-ad-b2c policy parameter', () => {
      const config = { stsServer: 'https://localhost:5001' } as OpenIdConfiguration;
      config.redirectUrl = 'https://localhost:44386';
      config.clientId = 'myid';
      config.responseType = 'id_token token';
      config.scope = 'openid email profile';
      config.postLogoutRedirectUri = 'https://localhost:44386/Unauthorized';

      const endSessionEndpoint = 'https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?p=b2c_1_sign_in';
      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        endSessionEndpoint,
      });
      const value = service.createEndSessionUrl('UzI1NiIsImtpZCI6Il', 'configId');

      const expectValue =
        'https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?p=b2c_1_sign_in' +
        '&id_token_hint=UzI1NiIsImtpZCI6Il' +
        '&post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A44386%2FUnauthorized';

      expect(value).toEqual(expectValue);
    });

    it('createEndSessionUrl create url without postLogoutRedirectUri when not given', () => {
      const config = {
        stsServer: 'https://localhost:5001',
        redirectUrl: 'https://localhost:44386',
        clientId: '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com',
        responseType: 'id_token token',
        scope: 'openid email profile',
        postLogoutRedirectUri: null,
      };

      configurationProvider.setConfig(config);
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        endSessionEndpoint: 'http://example',
      });

      const value = service.createEndSessionUrl('mytoken', 'configId');

      const expectValue = 'http://example?id_token_hint=mytoken';

      expect(value).toEqual(expectValue);
    });

    it('createEndSessionUrl returns null if no wellknownEndpoints given', () => {
      configurationProvider.setConfig({});

      const value = service.createEndSessionUrl('mytoken', 'configId');

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });

    it('createEndSessionUrl returns null if no wellknownEndpoints.endSessionEndpoint given', () => {
      configurationProvider.setConfig({});
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        endSessionEndpoint: null,
      });

      const value = service.createEndSessionUrl('mytoken', 'configId');

      const expectValue = null;

      expect(value).toEqual(expectValue);
    });
  });

  describe('getAuthorizeParUrl', () => {
    it('returns null if authWellKnownEndPoints is undefined', () => {
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);

      const result = service.getAuthorizeParUrl('', 'configId');

      expect(result).toBe(null);
    });

    it('returns null if authWellKnownEndPoints-authorizationEndpoint is undefined', () => {
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        notAuthorizationEndpoint: 'anything',
      });

      const result = service.getAuthorizeParUrl('', 'configId');

      expect(result).toBe(null);
    });

    it('returns null if configurationProvider.openIDConfiguration has no clientId', () => {
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'anything',
      });

      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId: null });
      const result = service.getAuthorizeParUrl('', 'configId');

      expect(result).toBe(null);
    });

    it('returns correct url when everything is given', () => {
      spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({
        authorizationEndpoint: 'anything',
      });

      spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ clientId: 'clientId' });
      const result = service.getAuthorizeParUrl('passedRequestUri', 'configId');

      expect(result).toBe('anything?request_uri=passedRequestUri&client_id=clientId');
    });
  });
});
