import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QualityStatus } from '@cme2/connector-quality';
import { QualityPaletteService } from '../services/quality-palette.service';

@Component({
  selector: 'cme-quality-palette',
  templateUrl: './quality-palette.component.html',
  styleUrls: ['./quality-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityPaletteComponent {
  Category = QualityStatus.CategoryEnum;

  constructor(public qualityPalette: QualityPaletteService) {}
}
