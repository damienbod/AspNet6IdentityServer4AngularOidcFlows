import { TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { createRetriableStream } from '../../../test/create-retriable-stream.helper';
import { DataService } from '../../api/data.service';
import { DataServiceMock } from '../../api/data.service-mock';
import { AuthWellKnownDataService } from './auth-well-known-data.service';

const DUMMY_WELL_KNOWN_DOCUMENT = {
  issuer: 'https://identity-server.test/realms/main',
  authorization_endpoint: 'https://identity-server.test/realms/main/protocol/openid-connect/auth',
  token_endpoint: 'https://identity-server.test/realms/main/protocol/openid-connect/token',
  userinfo_endpoint: 'https://identity-server.test/realms/main/protocol/openid-connect/userinfo',
  end_session_endpoint: 'https://identity-server.test/realms/main/master/protocol/openid-connect/logout',
  jwks_uri: 'https://identity-server.test/realms/main/protocol/openid-connect/certs',
  check_session_iframe: 'https://identity-server.test/realms/main/protocol/openid-connect/login-status-iframe.html',
  introspection_endpoint: 'https://identity-server.test/realms/main/protocol/openid-connect/token/introspect',
};

describe('AuthWellKnownDataService', () => {
  let service: AuthWellKnownDataService;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthWellKnownDataService, { provide: DataService, useClass: DataServiceMock }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AuthWellKnownDataService);
    dataService = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getWellKnownDocument', () => {
    it(
      'should add suffix if it does not exist on current url',
      waitForAsync(() => {
        const dataServiceSpy = spyOn(dataService, 'get').and.callFake((url) => {
          return of(null);
        });
        const urlWithoutSuffix = 'myUrl';
        const urlWithSuffix = `${urlWithoutSuffix}/.well-known/openid-configuration`;
        (service as any).getWellKnownDocument(urlWithoutSuffix, 'configId').subscribe(() => {
          expect(dataServiceSpy).toHaveBeenCalledWith(urlWithSuffix, 'configId');
        });
      })
    );

    it(
      'should not add suffix if it does exist on current url',
      waitForAsync(() => {
        const dataServiceSpy = spyOn(dataService, 'get').and.callFake((url) => {
          return of(null);
        });
        const urlWithSuffix = `myUrl/.well-known/openid-configuration`;
        (service as any).getWellKnownDocument(urlWithSuffix, 'configId').subscribe(() => {
          expect(dataServiceSpy).toHaveBeenCalledWith(urlWithSuffix, 'configId');
        });
      })
    );

    it(
      'should not add suffix if it does exist in the middle of current url',
      waitForAsync(() => {
        const dataServiceSpy = spyOn(dataService, 'get').and.callFake((url) => {
          return of(null);
        });
        const urlWithSuffix = `myUrl/.well-known/openid-configuration/and/some/more/stuff`;
        (service as any).getWellKnownDocument(urlWithSuffix, 'configId').subscribe(() => {
          expect(dataServiceSpy).toHaveBeenCalledWith(urlWithSuffix, 'configId');
        });
      })
    );

    it(
      'should retry once',
      waitForAsync(() => {
        spyOn(dataService, 'get').and.returnValue(createRetriableStream(throwError({}), of(DUMMY_WELL_KNOWN_DOCUMENT)));

        (service as any).getWellKnownDocument('anyurl', 'configId').subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(DUMMY_WELL_KNOWN_DOCUMENT);
          },
        });
      })
    );

    it(
      'should retry twice',
      waitForAsync(() => {
        spyOn(dataService, 'get').and.returnValue(createRetriableStream(throwError({}), throwError({}), of(DUMMY_WELL_KNOWN_DOCUMENT)));

        (service as any).getWellKnownDocument('anyurl', 'configId').subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(DUMMY_WELL_KNOWN_DOCUMENT);
          },
        });
      })
    );

    it(
      'should fail after three tries',
      waitForAsync(() => {
        spyOn(dataService, 'get').and.returnValue(
          createRetriableStream(throwError({}), throwError({}), throwError({}), of(DUMMY_WELL_KNOWN_DOCUMENT))
        );

        (service as any).getWellKnownDocument('anyurl', 'configId').subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
          },
        });
      })
    );
  });

  describe('getWellKnownEndPointsFromUrl', () => {
    it('calling internal getWellKnownDocument and maps', () => {
      spyOn<any>(dataService, 'get').and.returnValue(of({ jwks_uri: 'jwks_uri' }));

      const spy = spyOn(service as any, 'getWellKnownDocument').and.callThrough();
      service.getWellKnownEndPointsFromUrl('any-url', 'configId').subscribe((result) => {
        expect(spy).toHaveBeenCalled();
        expect((result as any).jwks_uri).toBeUndefined();
        expect(result.jwksUri).toBe('jwks_uri');
      });
    });
  });
});
