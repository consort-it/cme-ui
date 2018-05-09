import { Component, OnInit } from '@angular/core';
import { QualityPaletteService } from './quality-palette';
import { QualityService } from './services';

@Component({
  selector: 'cme-quality-view',
  templateUrl: './quality-view.component.html',
  styleUrls: ['./quality-view.component.scss'],
  providers: [QualityService]
})
export class QualityViewComponent implements OnInit {
  constructor(public qualityPalette: QualityPaletteService) {}

  ngOnInit() {}

  onPaletteVisibleChange(visible: boolean) {
    if (!visible) {
      this.qualityPalette.close();
    }
  }
}
