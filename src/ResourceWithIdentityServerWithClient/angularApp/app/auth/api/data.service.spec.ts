import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ConfigurationProvider } from '../config/provider/config.provider';
import { ConfigurationProviderMock } from '../config/provider/config.provider-mock';
import { DataService } from './data.service';
import { HttpBaseService } from './http-base.service';

describe('Data Service', () => {
  let dataService: DataService;
  let httpMock: HttpTestingController;
  let configurationProvider: ConfigurationProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, HttpBaseService, { provide: ConfigurationProvider, useClass: ConfigurationProviderMock }],
    });
  });

  beforeEach(() => {
    dataService = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
    configurationProvider = TestBed.inject(ConfigurationProvider);
  });

  it('should create', () => {
    expect(dataService).toBeTruthy();
  });

  describe('get', () => {
    it(
      'get call sets the accept header',
      waitForAsync(() => {
        const url = 'anyurl';
        dataService.get(url, 'configId').subscribe((data: unknown) => {
          expect(data).toBe('bodyData');
        });
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Accept')).toBe('application/json');

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'get call with token the accept header and the token',
      waitForAsync(() => {
        const url = 'anyurl';
        const token = 'token';
        dataService.get(url, 'configId', token).subscribe((data: unknown) => {
          expect(data).toBe('bodyData');
        });
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Accept')).toBe('application/json');
        expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'call without ngsw-bypass param by default',
      waitForAsync(() => {
        const url = 'anyurl';
        dataService.get(url, 'configId').subscribe((data: unknown) => {
          expect(data).toBe('bodyData');
        });
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Accept')).toBe('application/json');
        expect(req.request.params.get('ngsw-bypass')).toBeNull();

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'call with ngsw-bypass param',
      waitForAsync(() => {
        spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ configId: 'configId', ngswBypass: true });

        const url = 'anyurl';
        dataService.get(url, 'configId').subscribe((data: unknown) => {
          expect(data).toBe('bodyData');
        });
        const req = httpMock.expectOne(url + '?ngsw-bypass=');

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Accept')).toBe('application/json');
        expect(req.request.params.get('ngsw-bypass')).toBe('');

        req.flush('bodyData');

        httpMock.verify();
      })
    );
  });

  describe('post', () => {
    it(
      'call sets the accept header when no other params given',
      waitForAsync(() => {
        const url = 'anyurl';
        dataService.post(url, { some: 'thing' }, 'configId').subscribe();
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('Accept')).toBe('application/json');

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'call sets custom headers ONLY (No ACCEPT header) when custom headers are given',
      waitForAsync(() => {
        const url = 'anyurl';
        let headers = new HttpHeaders();
        headers = headers.set('X-MyHeader', 'Genesis');

        dataService.post(url, { some: 'thing' }, 'configId', headers).subscribe();
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('X-MyHeader')).toEqual('Genesis');
        expect(req.request.headers.get('X-MyHeader')).not.toEqual('Genesis333');

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'call without ngsw-bypass param by default',
      waitForAsync(() => {
        const url = 'anyurl';
        dataService.post(url, { some: 'thing' }, 'configId').subscribe();
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('Accept')).toBe('application/json');
        expect(req.request.params.get('ngsw-bypass')).toBeNull();

        req.flush('bodyData');

        httpMock.verify();
      })
    );

    it(
      'call with ngsw-bypass param',
      waitForAsync(() => {
        spyOn(configurationProvider, 'getOpenIDConfiguration').and.returnValue({ ngswBypass: true });

        const url = 'anyurl';
        dataService.post(url, { some: 'thing' }, 'configId').subscribe();
        const req = httpMock.expectOne(url + '?ngsw-bypass=');

        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('Accept')).toBe('application/json');
        expect(req.request.params.get('ngsw-bypass')).toBe('');

        req.flush('bodyData');

        httpMock.verify();
      })
    );
  });
});
