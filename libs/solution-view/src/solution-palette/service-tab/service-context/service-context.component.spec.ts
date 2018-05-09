import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MetaDataService, MetadataService, MetadataServiceType } from '@cme2/core-services';
import { MockLogService } from '@cme2/logging';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { ServiceContextComponent } from './service-context.component';
import { ServiceContextService } from './service-context.service';

describe('ServiceContextComponent', () => {
  const testMicroservice: MetadataService = {
    name: 'test-adapter',
    dependencies: 'val1,val2,val3',
    messageQueue: 'queue1,queue2,queue3',
    persistence: 'pers1,pers2,pers3',
    serviceType: MetadataServiceType.Backend
  };

  let mockMetadataService: MetaDataService;
  let mockContextService: ServiceContextService;
  let mockMatDialog: MatDialog;
  let mockMatIconRegistry: MatIconRegistry;
  let mockDomSanitizer: DomSanitizer;

  beforeEach(() => {
    mockMetadataService = mock(MetaDataService);
    mockMatDialog = mock(MatDialog);
    mockContextService = mock(ServiceContextService);
    mockMatIconRegistry = mock(MatIconRegistry);
    mockDomSanitizer = mock(DomSanitizer);
    when(mockContextService.currentMicroservice$).thenReturn(of(testMicroservice));
  });

  it('should split dependency properties correctly', (done: DoneFn) => {
    const sut = new ServiceContextComponent(
      new MockLogService(),
      instance(mockMatDialog),
      instance(mockMetadataService),
      instance(mockContextService),
      instance(mockMatIconRegistry),
      instance(mockDomSanitizer)
    );

    sut.dependencyItems.pipe(first()).subscribe(results => {
      expect(results).toEqual(['val1', 'val2', 'val3']);
      done();
    });
  });

  it('should split mq properties correctly', (done: DoneFn) => {
    const sut = new ServiceContextComponent(
      new MockLogService(),
      instance(mockMatDialog),
      instance(mockMetadataService),
      instance(mockContextService),
      instance(mockMatIconRegistry),
      instance(mockDomSanitizer)
    );

    sut.messageQueueItems.pipe(first()).subscribe(results => {
      expect(results).toEqual(['queue1', 'queue2', 'queue3']);
      done();
    });
  });

  it('should split persistence properties correctly', (done: DoneFn) => {
    const sut = new ServiceContextComponent(
      new MockLogService(),
      instance(mockMatDialog),
      instance(mockMetadataService),
      instance(mockContextService),
      instance(mockMatIconRegistry),
      instance(mockDomSanitizer)
    );

    sut.persistenceItems.pipe(first()).subscribe(results => {
      expect(results).toEqual(['pers1', 'pers2', 'pers3']);
      done();
    });
  });
});
