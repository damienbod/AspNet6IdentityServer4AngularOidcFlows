import { TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ConfigurationProvider } from '../config/provider/config.provider';
import { ConfigurationProviderMock } from '../config/provider/config.provider-mock';
import { FlowsService } from '../flows/flows.service';
import { FlowsServiceMock } from '../flows/flows.service-mock';
import { FlowHelper } from '../utils/flowHelper/flow-helper.service';
import { UrlService } from '../utils/url/url.service';
import { UrlServiceMock } from '../utils/url/url.service-mock';
import { CallbackService } from './callback.service';
import { CodeFlowCallbackService } from './code-flow-callback.service';
import { CodeFlowCallbackServiceMock } from './code-flow-callback.service-mock';
import { ImplicitFlowCallbackService } from './implicit-flow-callback.service';
import { ImplicitFlowCallbackServiceMock } from './implicit-flow-callback.service-mock';

describe('CallbackService ', () => {
  let callbackService: CallbackService;
  let implicitFlowCallbackService: ImplicitFlowCallbackService;
  let codeFlowCallbackService: CodeFlowCallbackService;
  let flowHelper: FlowHelper;
  let urlService: UrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CallbackService,
        { provide: UrlService, useClass: UrlServiceMock },
        { provide: ConfigurationProvider, useClass: ConfigurationProviderMock },
        { provide: FlowsService, useClass: FlowsServiceMock },
        { provide: ImplicitFlowCallbackService, useClass: ImplicitFlowCallbackServiceMock },
        { provide: CodeFlowCallbackService, useClass: CodeFlowCallbackServiceMock },
        FlowHelper,
      ],
    });
  });

  beforeEach(() => {
    callbackService = TestBed.inject(CallbackService);
    flowHelper = TestBed.inject(FlowHelper);
    implicitFlowCallbackService = TestBed.inject(ImplicitFlowCallbackService);
    codeFlowCallbackService = TestBed.inject(CodeFlowCallbackService);
    urlService = TestBed.inject(UrlService);
  });

  describe('isCallback', () => {
    it('calls urlService.isCallbackFromSts with passed url', () => {
      const urlServiceSpy = spyOn(urlService, 'isCallbackFromSts');

      callbackService.isCallback('anyUrl');
      expect(urlServiceSpy).toHaveBeenCalledOnceWith('anyUrl');
    });
  });

  describe('stsCallback$', () => {
    it('is of type Observable', () => {
      expect(callbackService.stsCallback$).toBeInstanceOf(Observable);
    });
  });

  describe('handleCallbackAndFireEvents', () => {
    it(
      'calls authorizedCallbackWithCode if current flow is code flow',
      waitForAsync(() => {
        spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(true);
        const authorizedCallbackWithCodeSpy = spyOn(codeFlowCallbackService, 'authenticatedCallbackWithCode').and.returnValue(of(null));

        callbackService.handleCallbackAndFireEvents('anyUrl', 'configId').subscribe(() => {
          expect(authorizedCallbackWithCodeSpy).toHaveBeenCalledWith('anyUrl', 'configId');
        });
      })
    );

    it(
      'calls authorizedImplicitFlowCallback if current flow is implicit flow',
      waitForAsync(() => {
        spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(false);
        spyOn(flowHelper, 'isCurrentFlowAnyImplicitFlow').and.returnValue(true);
        const authorizedCallbackWithCodeSpy = spyOn(implicitFlowCallbackService, 'authenticatedImplicitFlowCallback').and.returnValue(
          of(null)
        );

        callbackService.handleCallbackAndFireEvents('anyUrl', 'configId').subscribe(() => {
          expect(authorizedCallbackWithCodeSpy).toHaveBeenCalled();
        });
      })
    );

    it('emits callbackinternal no matter which flow it is', () => {
      const callbackSpy = spyOn((callbackService as any).stsCallbackInternal$, 'next');
      spyOn(flowHelper, 'isCurrentFlowCodeFlow').and.returnValue(true);
      const authorizedCallbackWithCodeSpy = spyOn(codeFlowCallbackService, 'authenticatedCallbackWithCode').and.returnValue(of(null));

      callbackService.handleCallbackAndFireEvents('anyUrl', 'configId').subscribe(() => {
        expect(authorizedCallbackWithCodeSpy).toHaveBeenCalledWith('anyUrl', 'configId');
        expect(callbackSpy).toHaveBeenCalled();
      });
    });
  });
});
