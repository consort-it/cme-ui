import { never } from 'rxjs/observable/never';
import { instance, mock, when } from 'ts-mockito';
import { subscribeFirstSynchronous } from '@cme2/testing';

import { SolutionPaletteService } from './solution-palette.service';
import { MetaDataService, MetadataServiceType } from '@cme2/core-services';
import { NeverObservable } from 'rxjs/observable/NeverObservable';

describe('SolutionPaletteService', () => {
  let metaMock: MetaDataService;

  beforeEach(() => {
    metaMock = mock(MetaDataService);
    when(metaMock.currentProject$).thenReturn(never());
  });

  it('should initially emit undefined as selection', () => {
    expect(
      subscribeFirstSynchronous(new SolutionPaletteService(instance(metaMock)).microserviceSelection$)
    ).toBeUndefined();
  });

  it('should emit a selection if one is set', () => {
    const sut = new SolutionPaletteService(instance(metaMock));
    sut.microserviceSelection = { name: 'test', serviceType: MetadataServiceType.Backend };
    expect(subscribeFirstSynchronous(sut.microserviceSelection$)).toEqual({
      name: 'test',
      serviceType: MetadataServiceType.Backend
    });
  });

  it('should emit undefined if undefined is set as microserviceSelection', () => {
    const sut = new SolutionPaletteService(instance(metaMock));
    sut.microserviceSelection = { name: 'test', serviceType: MetadataServiceType.Backend };
    sut.microserviceSelection = undefined; //NOSONAR
    expect(subscribeFirstSynchronous(sut.microserviceSelection$)).toBeUndefined();
  });
});
