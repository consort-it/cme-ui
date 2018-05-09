import { TestBed, inject } from '@angular/core/testing';

import { QualityPaletteService } from './quality-palette.service';

describe('QualityPaletteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QualityPaletteService]
    });
  });

  it(
    'should be created',
    inject([QualityPaletteService], (service: QualityPaletteService) => {
      expect(service).toBeTruthy();
    })
  );
});
