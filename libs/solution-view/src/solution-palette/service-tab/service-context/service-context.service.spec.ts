import { TestBed, inject } from '@angular/core/testing';

import { ServiceContextService } from './service-context.service';
import { GitLabBackendService, CommitMetadata } from '@cme2/connector-gitlab';
import { mock, anyNumber, anyString, when, instance } from 'ts-mockito/lib/ts-mockito';
import { of } from 'rxjs/observable/of';
import { MockLogService } from '@cme2/logging';
import { _throw } from 'rxjs/observable/throw';
import { MetaDataService, MetadataProject, MetadataService, MetadataServiceType } from '@cme2/core-services';
import { SolutionPaletteService } from '@cme2/solution-view';

const fakeProject: MetadataProject = {
  name: 'testproject',
  phases: [],
  id: '01',
  team: []
};

const fakeMicroservice: MetadataService = {
  name: 'test-service',
  serviceType: MetadataServiceType.Backend
};

describe('ServiceContextService', () => {
  let mockGitlabBackendService: GitLabBackendService;
  let mockMetadataService: MetaDataService;
  let mockPaletteService: SolutionPaletteService;

  beforeEach(() => {
    mockGitlabBackendService = mock(GitLabBackendService);
    mockMetadataService = mock(MetaDataService);
    when(mockMetadataService.currentProject$).thenReturn(of(fakeProject));

    mockPaletteService = mock(SolutionPaletteService);
    when(mockPaletteService.microserviceNameSelection$).thenReturn(of(fakeMicroservice.name));
    when(mockPaletteService.microserviceSelection$).thenReturn(of(fakeMicroservice));
  });

  describe('hasApiEndpoints', () => {
    it('should return true if there is a swagger file', (done: DoneFn) => {
      when(mockGitlabBackendService.getMetadataForFile('test-service', anyString(), anyNumber())).thenReturn(
        of([<any>{}])
      );

      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasApiEndpoints('test-service-v42').subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should return false if there is no swagger file', (done: DoneFn) => {
      when(mockGitlabBackendService.getMetadataForFile('test-service', anyString(), anyNumber())).thenReturn(of([]));

      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasApiEndpoints('test-service-v42').subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });

    it('should return false if there is an error while retrieving swagger file', (done: DoneFn) => {
      when(mockGitlabBackendService.getMetadataForFile('test-service', anyString(), anyNumber())).thenReturn(
        _throw('Error')
      );

      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasApiEndpoints('test-service-v42').subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('hasScopes', () => {
    const swaggerDummySecurityDefinitions = `
securityDefinitions:
  petstore_auth:
    type: "oauth2"
    authorizationUrl: "http://petstore.swagger.io/oauth/dialog"
    flow: "implicit"
    scopes:
      write:pets: "modify pets in your account"
      read:pets: "read your pets"
      `;

    it('should return true if there is a scopes section in swagger file', (done: DoneFn) => {
      when(mockGitlabBackendService.getFileAsString('test-service', anyString(), 'body', 'text')).thenReturn(
        of(swaggerDummySecurityDefinitions)
      );

      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasScopes('test-service-v42').subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should return false if there is no scopes section in swagger file', (done: DoneFn) => {
      when(mockGitlabBackendService.getFileAsString('test-service', anyString(), 'body', 'text')).thenReturn(
        of('some string')
      );

      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasScopes('test-service-v42').subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });

    it('should return false if there is an error while retrieving swagger file contents', (done: DoneFn) => {
      when(mockGitlabBackendService.getFileAsString('test-service', anyString(), 'body', 'text')).thenReturn(
        _throw('Error')
      );
      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.hasScopes('test-service-v4').subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('currentMicroservice$', () => {
    it('should return the current service if metadataService and paletteService contains correct data', (done: DoneFn) => {
      when(mockMetadataService.currentProject$).thenReturn(
        of(<MetadataProject>{
          id: '1',
          phases: [
            {
              name: 'test-phase',
              services: [
                {
                  name: 'test-service',
                  serviceType: MetadataServiceType.Backend
                }
              ]
            }
          ]
        })
      );

      when(mockPaletteService.microserviceNameSelection$).thenReturn(of('test-service'));
      const sut = new ServiceContextService(
        new MockLogService(),
        instance(mockGitlabBackendService),
        instance(mockMetadataService),
        instance(mockPaletteService)
      );

      sut.currentMicroservice$.subscribe(result => {
        expect(result!.name).toEqual('test-service');
        done();
      });
    });
  });
});
