import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiModule as MetadataServiceModule, ProjectService } from '@cme2/connector-metadata';
import { MetadataServiceType, StorageService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { describePact, fdescribePact } from '@cme2/testing';
import { Matchers, PactWeb } from '@pact-foundation/pact-web';
import { instance, mock } from 'ts-mockito';

import { LocalStorageService } from '../storage/local-storage.service';
import { MetaDataService } from './meta-data.service';
import { MetadataProject } from './model/meta-data-project';

describePact('MetaDataService pact', 'metadata-service', (provider: PactWeb, pactTestModule: Type<any>) => {
  beforeEach(() => {
    TestBed.overrideModule(pactTestModule, {
      add: {
        imports: [MetadataServiceModule.forRoot()],
        providers: [
          MetaDataService,
          { provide: StorageService, useFactory: () => instance(mock(LocalStorageService)) },
          { provide: LogService, useFactory: () => instance(mock(LogService)) }
        ]
      }
    });
  });

  describe('getProjects()', () => {
    it('should return existing projects', async (done: DoneFn) => {
      const expectedProject: MetadataProject = {
        id: 'ID',
        name: 'project-name',
        team: [],
        phases: [
          {
            name: 'a phase',
            services: [
              {
                name: 'a service',
                description: 'a description',
                icon: 'icon',
                serviceType: MetadataServiceType.UI,
                url: 'localhost'
              }
            ]
          }
        ]
      };

      await provider
        .addInteraction({
          state: 'provider has some existing projects',
          uponReceiving: 'a request to GET projects',
          withRequest: {
            method: 'GET',
            path: '/api/v1/metadata-service/projects'
          },
          willRespondWith: {
            status: 200,
            body: Matchers.eachLike(expectedProject),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const metaDataService = TestBed.get(MetaDataService) as MetaDataService;
      metaDataService.getProjects().subscribe(
        response => {
          expect(response).toEqual([expectedProject]);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });

    it('should return empty list if no projects exist', async (done: DoneFn) => {
      await provider
        .addInteraction({
          state: 'provider has no existing project',
          uponReceiving: 'a request to GET projects',
          withRequest: {
            method: 'GET',
            path: '/api/v1/metadata-service/projects'
          },
          willRespondWith: {
            status: 200,
            body: [],
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const metaDataService = TestBed.get(MetaDataService) as MetaDataService;
      metaDataService.getProjects().subscribe(
        response => {
          expect(response).toEqual([]);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });

  describe('updateProject()', () => {
    it('should update existing project', async (done: DoneFn) => {
      const expectedUpdatedProject = {
        id: 'ID',
        name: 'project-name',
        team: [{ name: 'Markus', roles: ['Dev', 'Ressource'], email: 'me@mail.de' }],
        phases: [
          {
            name: 'a phase',
            services: [
              {
                name: 'a service',
                description: 'a description',
                icon: 'icon',
                serviceType: MetadataServiceType.UI,
                url: 'localhost'
              }
            ]
          }
        ]
      };

      await provider
        .addInteraction({
          state: 'provider has an existing project with id 1',
          uponReceiving: 'a request to PUT project with id 1',
          withRequest: {
            method: 'PUT',
            path: '/api/v1/metadata-service/projects/1',
            body: expectedUpdatedProject
          },
          willRespondWith: {
            status: 200,
            body: Matchers.somethingLike(expectedUpdatedProject),
            headers: {
              'content-type': 'application/json'
            }
          }
        })
        .catch(reason => done.fail(reason));

      const metaDataService = TestBed.get(MetaDataService) as MetaDataService;
      metaDataService.updateProject('1', expectedUpdatedProject).subscribe(
        response => {
          expect(response).toEqual(expectedUpdatedProject);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });
});
