import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { QualityBackendService, QualityIndex, QualityStatus } from '@cme2/connector-quality';
import { MetaDataService } from '@cme2/core-services';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { first } from 'rxjs/operators';
import { anything, instance, mock, when } from 'ts-mockito';
import { QualityService } from './quality.service';

describe('QualityService', () => {
  describe('solutionHealthIndex$', () => {
    it(
      'should emit solutionHealthIndex when backend returns a value',
      fakeAsync(() => {
        const mockMetaDataService = mock(MetaDataService);
        when(mockMetaDataService.currentServices$).thenReturn(of(['service1', 'service2']));

        const mockQualityBackendService = mock(QualityBackendService);
        when(mockQualityBackendService.getQualityIndex(anything())).thenReturn(
          of(<QualityIndex>{
            generatedAt: new Date(),
            value: 42
          })
        );

        const sut = new QualityService(
          new MockLogService(),
          instance(mockQualityBackendService),
          instance(mockMetaDataService)
        );

        let done = false;
        sut.solutionHealthIndex$.pipe(first()).subscribe(x => {
          expect(x!.value).toEqual(42);
          done = true;
        });
        tick();
        expect(done).toBeTruthy();
        discardPeriodicTasks();
      })
    );

    it(
      'should emit undefined when backend returns an error',
      fakeAsync(() => {
        const mockMetaDataService = mock(MetaDataService);
        when(mockMetaDataService.currentServices$).thenReturn(of(['service1', 'service2']));

        const mockQualityBackendService = mock(QualityBackendService);
        when(mockQualityBackendService.getQualityIndex(anything())).thenReturn(_throw(new Error()));

        const sut = new QualityService(
          new MockLogService(),
          instance(mockQualityBackendService),
          instance(mockMetaDataService)
        );

        let done = false;
        sut.solutionHealthIndex$.pipe(first()).subscribe(x => {
          expect(x).toBeUndefined();
          done = true;
        });
        tick();
        expect(done).toBeTruthy();
        discardPeriodicTasks();
      })
    );
  });
});
